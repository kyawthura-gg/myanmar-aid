import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import {
  intro,
  outro,
  log,
  select,
  text,
  spinner,
  isCancel,
} from "@clack/prompts";
import parseArgv from "tiny-parse-argv";
import { parse as parseJsonc } from "comment-json";

const asyncExec = (command: string) =>
  new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });

async function getDatabase(
  databases: { value: string; label: string }[],
  database: string | undefined
) {
  if (databases.length === 0) {
    log.error("No D1 databases found in wrangler.jsonc");
    process.exit(1);
  }

  database =
    database ||
    ((await select({
      message: "Select a database",
      options: databases,
      initialValue: databases[0]?.value,
    })) as string);

  if (isCancel(database)) {
    process.exit(1);
  }
  return database;
}

async function main() {
  const args = parseArgv(process.argv.slice(2));
  const command = args._[0];

  const projectRoot = path.resolve();

  intro("D1 Prisma Migrate CLI");

  if (args.help || !command) {
    switch (command) {
      case "create":
        log.message(`migrate create
    Create a new migration
    Options:
      -n, --name - The name of the migration
      -d, --database - The name of the D1 database
      --create-only - Only create the migration file, do not apply it
      --schema - Custom path to the Prisma schema
      -h, --help - Show this help message`);
        break;
      case "apply":
        log.message(`migrate apply
    Apply pending migrations
    Options:
      -d, --database - The name of the D1 database
      --remote - Apply migrations to your remote database
      --schema - Custom path to the Prisma schema
      -h, --help - Show this help message`);
        break;
      default:
        log.message(`migrate <command>
    Commands:
      create - Create a new migration
      apply - Apply pending migrations
    Options:
      -h, --help - Show this help message`);
        break;
    }
    process.exit(0);
  }

  let wranglerConfig: any;

  try {
    const wranglerJson = await fs.readFile("./wrangler.jsonc", "utf-8");
    wranglerConfig = parseJsonc(wranglerJson);
  } catch {
    log.error("Could not read wrangler.jsonc");
    process.exit(1);
  }

  const databases: { value: string; label: string }[] =
    wranglerConfig.d1_databases?.map((db: { database_name: string }) => ({
      value: db.database_name,
      label: db.database_name,
    })) || [];

  let database: string | undefined =
    args.d || args.database || databases[0]?.value;

  if (command === "create") {
    database = await getDatabase(databases, database);

    const migrationName =
      args.name ||
      args.n ||
      (await text({
        message: "What is the name of the migration?",
        validate: (input) => {
          if (input.length === 0) {
            return "Migration name cannot be empty";
          }
        },
      }));

    if (isCancel(migrationName)) {
      process.exit(1);
    }

    const s = spinner();
    s.start("Creating migration");
    const result = await asyncExec(
      `npx wrangler d1 migrations create ${database} "${migrationName}"`
    );

    s.stop("Creating migration");

    const resultLines = result.trim().split("\n");
    let pathIndex = resultLines.findIndex((line) => line.endsWith(".sql"));
    if (pathIndex === -1) {
      log.error("Could not find migration path");
      process.exit(1);
    }

    let migrationPath = "";

    while (pathIndex >= 0 && !migrationPath.startsWith("/")) {
      migrationPath = resultLines[pathIndex--] + migrationPath;
    }

    s.start("Generating migration diff from Prisma schema");

    await asyncExec(
      `npx prisma migrate diff --script --from-local-d1 --to-schema-datamodel ${
        args.schema || "./prisma/schema.prisma"
      } >> ${migrationPath}`
    );

    s.stop("Generating migration diff from Prisma schema");

    if (args["create-only"]) {
      outro(`Migration created at ${migrationPath.replace(projectRoot, ".")}`);
      process.exit();
    }
  }

  if (command === "apply" || command === "create") {
    database = await getDatabase(databases, database);

    const s = spinner();
    s.start(
      `Applying migrations: ${database} ${args.remote ? "REMOTE" : "LOCAL"}`
    );
    await asyncExec(
      `npx wrangler d1 migrations apply ${database} ${
        args.remote ? "--remote" : "--local"
      }`
    );

    s.stop("Applying migrations");

    if (!args.remote) {
      s.start("Generating Prisma client");
      await asyncExec(
        `npx prisma generate ${args.schema ? `--schema ${args.schema}` : ""}`
      );

      s.stop("Generating Prisma client");
    }

    outro("Migrations applied");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
