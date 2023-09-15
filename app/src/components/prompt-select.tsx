import { api } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import React from 'react'

interface PromptsProps{
    id: string, 
    title: string,
    template: string
}

interface PromptSelectProps{
    onPromptSelected: (template : string) => void
}

export function PromptSelect(props : PromptSelectProps){
    const[prompts, setPrompts] = React.useState<PromptsProps[] | null>(null)

    React.useEffect(() => {
        api.get('/prompts').then(response=> {
            setPrompts(response.data)
        })
    }, [])
    
    const handlePromptSelected = (promptId : string) => {
        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

        if (!selectedPrompt){
            return
        }

        props.onPromptSelected(selectedPrompt.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder="Selecione um prompt..."/>
            </SelectTrigger>
            <SelectContent>
                {
                    prompts?.map(prompt => {
                        return (
                            <SelectItem key={prompt.id} value={prompt.id}>
                                {prompt.title}
                            </SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )
}