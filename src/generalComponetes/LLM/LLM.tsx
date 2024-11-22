import useLLM from "usellm"



export const LLM = () => {
const llm = useLLM({
    serviceUrl: "https://api.usellm.com",
})

  return (
    <div> 
        <h1>LLM here</h1>
        <button 
        onClick={async () => {
            const response = await llm.chat({
            
                messages: [
            
                    { role: "user", content: "hola que tal" },
                ],
            })
            console.log(response)
        }}
        
        >Send</button>
    </div>
  )
}
