"use client"
import { Billing } from "@/components/settings/billing";
import { Profile } from "@/components/settings/profile";
import { useParams } from "next/navigation";

export default function SettingsPage() {
    const { slug } = useParams() as { slug?: string };
    switch (slug) {
        case "profile":
            return <Profile />
        case "billing":
            return <Billing />
        default:
            return null
    }
}