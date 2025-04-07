"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateUser } from "@/lib/auth-client"
import { mimeTypes } from "@/lib/mime-types"
import { getStorageFullURL } from "@/lib/utils"
import { api } from "@/trpc/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { PencilIcon, UploadIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.union([z.string(), z.instanceof(File)]).nullish(),
})

type FormValues = z.infer<typeof formSchema>

export const EditProfile = ({
  name,
  image,
}: { name: string; image?: string | null }) => {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const uploadMutation = api.upload.getSignedURLS.useMutation()

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      image,
    },
  })

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    let profileImage = image
    if (values.image instanceof File) {
      const signedValues = await uploadMutation.mutateAsync({
        fileFormats: [mimeTypes?.[values.image.type] ?? "jpg"],
      })
      const signed = signedValues[0]

      const responseUpload = await fetch(signed?.url, {
        method: "PUT",
        body: values.image,
      })
      if (!responseUpload.ok) {
        throw new Error("something went wrong while upload")
      }
      profileImage = signed.key
    }
    await updateUser({
      name: values.name,
      image: profileImage,
    })
    router.refresh()
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(v) => setIsDialogOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PencilIcon className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="profile">Profile Picture</FormLabel>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      {field.value ? (
                        <AvatarImage
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value.startsWith("/")
                                ? getStorageFullURL(field.value)
                                : field.value
                          }
                          alt=""
                        />
                      ) : (
                        <AvatarFallback>
                          <UserIcon className="h-10 w-10 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="grid w-full items-center gap-1.5">
                      <FormLabel
                        htmlFor="picture"
                        className="cursor-pointer flex items-center justify-center gap-2 border rounded-md p-2 hover:bg-muted transition-colors"
                      >
                        <UploadIcon className="h-4 w-4" />
                        Choose Image
                      </FormLabel>
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0])
                        }}
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                className="w-[140px]"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
