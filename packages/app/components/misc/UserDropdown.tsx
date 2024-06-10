"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SwitchOrganization from "@/app/studio/[organization]/components/SwitchOrganization"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { SignInUserButton } from "./SignInUserButton"
import { Button } from "../ui/button"
import { IExtendedOrganization } from "@/lib/types"
import { Label } from "@radix-ui/react-dropdown-menu"

const UserDropdown = ({
  organization,
  organizations
}: {
  organization?: string
  organizations?: IExtendedOrganization[]

}) => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col">
        <Button variant="link">
          <span className="text-sm font-medium">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="py-2">
          <DropdownMenuItem>
            <ConnectWalletButton />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col">
            
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignInUserButton />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown