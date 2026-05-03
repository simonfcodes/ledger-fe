import { AlertCircleIcon } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"

const FormAlert: React.FC<{ title: string, description: string, type: "error" | "info" }> = ({title, description, type}) => {
    return (
        <Alert variant={type === "error" ? "destructive" : "default"} className="mt-4">
            <AlertCircleIcon className="w-4 h-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}

export default FormAlert