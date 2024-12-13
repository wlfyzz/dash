"use client"
import { styled } from "@stitches/react";
import * as React from "react"
import { Cog, LogOut, User, Clock } from 'lucide-react'
import { signOut } from "next-auth/react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserProfile } from "./profile"
import { Providers } from "@/providers"
import { Settings } from "./settings"

interface RecentTab {
  id: string
  title: string
  url: string
}
const StyledCommandDialog = styled(CommandDialog, {
  '& [cmdk-list]': {
    overflow: 'hidden',
    maxHeight: '300px',
  },
});


export function Command() {
  const [open, setOpen] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false)
  const [recentTabs, setRecentTabs] = React.useState<RecentTab[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const storedTabs = localStorage.getItem('recent')
    if (storedTabs) {
      try {
        const parsedTabs = JSON.parse(storedTabs)
        setRecentTabs(parsedTabs)
      } catch (error) {
        console.error('Error parsing recent tabs:', error)
      }
    }
  }, [])

  const openProfileModal = () => {
    setOpen(false)
    setIsProfileOpen(true)
  }
  const openSettingsModal = () => {
    setOpen(false)
    setIsSettingsOpen(true)
  }
  const openLogoutMenu = () => {
    setOpen(false)
    setIsLogoutDialogOpen(true)
  }
  const handleLogout = async () => {
    setIsLogoutDialogOpen(false)
    await signOut({ redirect: true })
  }

  const openRecentTab = (url: string) => {
    window.location.href = url
    setOpen(false)
  }

  return (
    <>
    <Providers>
      <StyledCommandDialog  open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {recentTabs.length > 0 && (
            <CommandGroup heading="Recent">
              {recentTabs.map((tab) => (
                <CommandItem key={tab.id} onSelect={() => openRecentTab(tab.url)}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{tab.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={openProfileModal}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem onSelect={openSettingsModal}>
              <Cog className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem onSelect={openLogoutMenu}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </StyledCommandDialog >

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="p-0 bg-transparent border-0 shadow-none">
          <UserProfile />
        </DialogContent>
      </Dialog>
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="p-0 bg-transparent border-0 shadow-none">
          <Settings />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action will end your current session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Providers>
    </>
  )
}

