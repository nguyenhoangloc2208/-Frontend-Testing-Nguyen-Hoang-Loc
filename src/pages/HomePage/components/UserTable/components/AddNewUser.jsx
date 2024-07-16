import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PlaceHolderImage from "../../../../../assets/image/placeholdler_image.svg";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AddNewUser = ({ formSchema, mutate }) => {
  const { toast } = useToast();
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isShowConfirmPassWord, setIsShowConfirmPassWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "user",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  });

  const uploadImageToCloudinary = async (image) => {
    const formdata = new FormData();
    formdata.append("file", image);
    formdata.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formdata.append("timestamp", Math.round(new Date().getTime() / 1000));
    formdata.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drrvltkaz/image/upload",
        formdata
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (value) => {
    setIsLoading(true);
    try {
      let avatarUrl = value.avatar;

      if (avatarUrl) {
        const uploadedImageUrl = await uploadImageToCloudinary(avatarUrl);
        if (uploadedImageUrl) {
          avatarUrl = uploadedImageUrl;
        }
      }

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/`, {
        username: value.firstName + value.lastName,
        password: value.password,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        phoneNumber: value.phone,
        role: value.role,
        avatar: avatarUrl ? avatarUrl : "",
      });
      toast({
        description: "Success!",
      });
      mutate();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data.message ||
          "There was a problem with your request.",
      });
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevImage(image);
        setImage(reader.result);
        form.setValue("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCancelImageChange = () => {
    handleImageChange(prevImage);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="lg:text-base text-sm lg:px-4 px-2">
          Add New User
        </Button>
      </DialogTrigger>
      {isLoading ? (
        <DialogContent className="sm:max-w-[800px] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="hidden lg:block">Add new user</DialogTitle>
          </DialogHeader>
          <div className="flex w-full space-x-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full">
                <div className="flex w-full">
                  <div className="lg:w-3/5 w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="role">Role</FormLabel>
                          <FormControl>
                            <Controller
                              control={form.control}
                              name="role"
                              render={({ field }) => (
                                <Select
                                  id="role"
                                  value={field.value}
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Roles" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="admin">
                                        Admin
                                      </SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="editor">
                                        Editor
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="phone">Phone number *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              id="phone"
                              placeholder="0911222333"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <div className="w-1/2">
                            <FormLabel htmlFor="firstName">
                              First Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="firstName"
                                placeholder="John"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <div className="w-1/2">
                            <FormLabel htmlFor="lastName">
                              Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                id="lastName"
                                placeholder="Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">Password *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={isShowPassWord ? "text" : "password"}
                                placeholder="Enter password"
                                className="mb-5"
                                {...field}
                              />
                              <div
                                onClick={() =>
                                  setIsShowPassWord(!isShowPassWord)
                                }
                                className="absolute cursor-pointer top-2 right-2">
                                {isShowPassWord ? <EyeOff /> : <Eye />}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="confirmPassword">
                            Confirm Password *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={
                                  isShowConfirmPassWord ? "text" : "password"
                                }
                                placeholder="Confirm password"
                                {...field}
                              />
                              <div
                                onClick={() =>
                                  setIsShowConfirmPassWord(
                                    !isShowConfirmPassWord
                                  )
                                }
                                className="absolute cursor-pointer top-2 right-2">
                                {isShowConfirmPassWord ? <EyeOff /> : <Eye />}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem className="lg:hidden">
                          <FormLabel htmlFor="avatar">
                            Profile Picture
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              id="avatar"
                              onChange={handleImageChange}
                              {...field.avatar}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator
                    className="hidden md:block w-[1px] mx-5 h-auto"
                    orientation="vertical"
                  />
                  <div className="lg:w-1/3 lg:flex hidden">
                    <div className="flex flex-col items-center w-full gap-5">
                      <Label className="text-lg">Profile Picture</Label>
                      <div className="w-2/3 mb-4 bg-gray-200 overflow-hidden aspect-w-1 aspect-h-1 rounded-3xl">
                        <div className="w-full">
                          <img
                            src={image ? image : PlaceHolderImage}
                            alt="Profile"
                            className="object-cover w-full h-auto"
                          />
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Select Image</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Select Profile Picture</DialogTitle>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <div className="flex justify-end mt-4 space-x-2">
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                onClick={handleCancelImageChange}>
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="primary">Done</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sm:justify-start">
                  <Button type="submit">Add User</Button>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddNewUser;
