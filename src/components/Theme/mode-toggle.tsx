import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/Theme/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (

    <Button variant="ghost" size="icon" onClick={()=> theme == "dark" ? setTheme("light"): setTheme("dark")}>
          <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className=" text-white absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        

  )
}
