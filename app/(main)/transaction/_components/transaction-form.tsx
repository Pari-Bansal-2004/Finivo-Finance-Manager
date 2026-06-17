"use client";

import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar1Icon, Ghost, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReceiptScanner from "./receipt-scanner";
import { RecurringInterval } from "@prisma/client";

const AddTransactionForm = ({ accounts, categories, editMode, initialData }: { accounts: any[]; categories: any[]; editMode: boolean; initialData: any }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const {register, setValue, handleSubmit, formState:{errors}, watch,getValues,
reset,}= useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: 
        editMode && initialData? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval &&{
                RecurringInterval: initialData.recurringInterval,
            }),
        }:{
            type: "EXPENSE",
            amount:"",
            description:"",
            accountId: accounts.find((ac: any) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
        },
    });

    const {
        loading: transactionLoading,
        fn: addTransactionFn,
        data: transactionResult,
    } = useFetch(editMode? updateTransaction : createTransaction);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const onSubmit = async (data: any) => {
        const formData = {
            ...data,
            amount: parseFloat(data.amount),
        };

        if(editMode){
            addTransactionFn(editId,formData);
        }
        else{
            addTransactionFn(formData);
        }
    };

    useEffect(()=>{
        if(transactionResult?.success && !transactionLoading){
            toast.success(editMode ? "Transaction Updated Successfully" : "Transaction Created Successfully");
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    },[transactionResult, transactionLoading, editMode])

    const filteredCategories = categories.filter((category: any) => category.type === type);

    const handleScanComplete=(scannedData:any)=>{
        if(scannedData){
            setValue("amount", scannedData.amount.toString());
            setValue("date", new Date(scannedData.date));
            if(scannedData.description){
                setValue("description", scannedData.description);
            }
            if(scannedData.category){
                setValue("category", scannedData.category);
            }
        }
    };

    return (
        <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* AI Recipt Scanner */}
            {!editMode &&<ReceiptScanner onScanComplete={handleScanComplete}/>}

            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Type</label>
                <Select onValueChange={(value) => setValue("type", value as "EXPENSE" | "INCOME")} defaultValue={type}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                </Select>

                {errors.type && (
                    <p className="text-red-500 text-sm">{errors.type?.message as string}</p>
                )}
            </div>

            <div className="grid gap-6 md: grid-cols-2 w-full">
            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Amount</label>
                <Input
                className="w-full"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount")}
                />

                {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount?.message as string}</p>
                )}
            </div>

            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Account</label>
                <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((account: any)=> (
                            <SelectItem key={account.id} value={account.id}>
                                {account.name} (${account.balance.toFixed(2)})
                            </SelectItem>
                        ))}

                        <CreateAccountDrawer>
                            <Button variant="ghost" className="w-full select-none items-center text-sm outline-none">Create Account</Button>
                        </CreateAccountDrawer>
                    </SelectContent>
                </Select>

                {errors.accountId && (
                    <p className="text-red-500 text-sm">{errors.accountId?.message as string}</p>
                )}
            </div>
            </div>

            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Category</label>
                <Select onValueChange={(value) => setValue("category", value )} defaultValue={getValues("category")}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent >
                        {filteredCategories.map((category: any)=> (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category?.message as string}</p>
                )}
            </div>

            <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant='outline' className="w-full pl-3 text-left font-normal">
                            {date ? format(date, "PPP") : <span>Pick a Date</span>}
                            <Calendar1Icon className="ml-auto h-4 w-4 opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} 
                        onSelect={(date)=> setValue("date", date as Date)}
                        disabled={(date)=> date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
                
                {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date?.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter Description" {...register("description")} />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description?.message as string}</p>
                )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                        Recurring Transaction
                    </label>
                    <p className="text-sm text-muted-foreground">
                        Set up a Recurring schedule for this Transaction.
                    </p>
                </div>
                            
                <Switch 
                    checked={isRecurring}
                    onCheckedChange={(checked)=> setValue("isRecurring", checked)}
                />
            </div>

            {isRecurring && (
                <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Recurring Interval</label>
                <Select onValueChange={(value) => setValue("recurringInterval", value as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | undefined)} defaultValue={getValues("recurringInterval")}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                </Select>

                {errors.recurringInterval && (
                    <p className="text-red-500 text-sm">{errors.recurringInterval?.message as string}</p>
                )}
            </div>
            )}

            <div className="flex gap-4">
                <Button type="button" variant="outline" 
                onClick={()=> router.back()}>
                    Cancel
                </Button>
                <Button type="submit"  disabled={transactionLoading}>
                    {transactionLoading?(
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            {editMode ? "Updating..." : "Creating..."}
                        </>
                    ): editMode ? (
                        "Update Transaction"
                    ):(
                        "Create Transaction"
                    )}
                </Button>
            </div>

        </form>
    )
}

export default AddTransactionForm;
