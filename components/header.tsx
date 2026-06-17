
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Show } from "@clerk/nextjs";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

export const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo1.png"}
            alt={"finovo logo"}
            height={60}
            width={200}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex justify-end items-center p-4 gap-4 h-16">
          <div className="flex items-center space-x-4">
            <Show when="signed-in">
              <Link href={"/dashboard"}>
                <span className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                  <Button variant="outline">
                    <LayoutDashboard size={18} />
                    <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </span>
              </Link>

              <Link href={"/transaction/create"}>
                <Button className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </Show>

            <Show when="signed-out">
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
