"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadResource } from "@/lib/upload-resource";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    resource_type: z.string().min(1, {
        message: "Please select a resource type.",
    }),
    subject: z.string().min(2, {
        message: "Subject is required.",
    }),
    semester: z.string().min(1, {
        message: "Please select a semester.",
    }),
    branch: z.string().min(1, {
        message: "Please select a branch.",
    }),
    year_batch: z.string().min(4, {
        message: "Year/Batch is required.",
    }),
    privacy: z.string().default("public"),
    description: z.string().optional(),
    file: z
        .custom<any>() // Use any to avoid FileList vs File type clashes
        .refine((files) => files?.length === 1, "File is required.")
        .refine((files) => files?.[0]?.size <= 50000000, `Max file size is 50MB.`),
});

export default function UploadPage() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    // 1. Define your form.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subject: "",
            year_batch: "",
            description: "",
            privacy: "public",
        },
    });

    // 2. Define a submit handler.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onSubmit(values: any) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("resource_type", values.resource_type);
        formData.append("subject", values.subject);
        formData.append("semester", values.semester);
        formData.append("branch", values.branch);
        formData.append("year_batch", values.year_batch);
        formData.append("privacy", values.privacy);
        if (values.description) formData.append("description", values.description);

        // Handle file specifically
        const file = values.file[0];
        formData.append("file", file);

        try {
            await uploadResource(formData);
            toast.success("Resource uploaded successfully!");
            router.push("/resources");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload resource. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Upload Resource</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Engineering Mathematics 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="resource_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resource Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Note">Notes</SelectItem>
                                            <SelectItem value="Question Paper">Question Paper</SelectItem>
                                            <SelectItem value="Solution">Solution</SelectItem>
                                            <SelectItem value="Project Report">Project Report</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="branch"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Branch" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="CSE">CSE</SelectItem>
                                            <SelectItem value="ISE">ISE</SelectItem>
                                            <SelectItem value="ECE">ECE</SelectItem>
                                            <SelectItem value="ME">ME</SelectItem>
                                            <SelectItem value="CV">CV</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="semester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Semester" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">1st Semester</SelectItem>
                                            <SelectItem value="2">2nd Semester</SelectItem>
                                            <SelectItem value="3">3rd Semester</SelectItem>
                                            <SelectItem value="4">4th Semester</SelectItem>
                                            <SelectItem value="5">5th Semester</SelectItem>
                                            <SelectItem value="6">6th Semester</SelectItem>
                                            <SelectItem value="7">7th Semester</SelectItem>
                                            <SelectItem value="8">8th Semester</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Data Structures" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="year_batch"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year/Batch</FormLabel>
                                <FormControl>
                                    <Input placeholder="2022-2026" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Brief description of the resource..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>File</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        placeholder="File"
                                        type="file"
                                        accept=".pdf,.docx,.ppt,.pptx,.jpg,.png,.jpeg"
                                        onChange={(event) => {
                                            onChange(event.target.files);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
