import './App.css'
import {createAzureOpenAILanguageModel, createJsonTranslator} from "typechat";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";


type FormData = {
    endpoint: string,
    key: string,
    typeName: string,
    schema: string,
    query: string
}

function App() {
    const [formData, setFormData] = useState<FormData>({
        endpoint: "https://api.openai.com/v1/engines/davinci/completions",
        key: "123456",
        typeName: "Person",
        schema:
            "export interface Person {\n" +
            "  name: string;\n" +
            "  age: number;\n" +
            "  gender: string;\n" +
            "  hobby: string;\n" +
            "  job: string;\n" +
            "}",
        query: "我叫田瑗，性别女，1990年出生，喜欢户外运动，职业与旅游相关",
    });
    const {handleSubmit, register, reset} = useForm({
        defaultValues: formData
    });

    useEffect(() => {
        const storageFormData = localStorage.getItem("formData")
        if (storageFormData) {
            setFormData(JSON.parse(storageFormData))
        }
    }, [])

    useEffect(() => {
        reset(formData)
    }, [formData, reset])

    const doTrans = async (data: FormData) => {
        localStorage.setItem("formData", JSON.stringify(data))
        console.log(data)
        // Process requests interactively or from the input file specified on the command line
        const model = createAzureOpenAILanguageModel(data.key, data.endpoint);
        const translator = createJsonTranslator(model, data.schema, data.schema);


        const response = await translator.translate(data.query);
        if (!response.success) {
            console.log(response.message);
        }
        console.log(`The sentiment is ${JSON.stringify(response)}`);
    }

    return (
        <div className={"main bg-base-200 flex flex-row p-1 w-full min-h-screen"}>
            <form onSubmit={handleSubmit(doTrans)} className={"flex w-1/2  items-center flex-col"}>
                <div className={"flex flex-col w-5/6"}>
                    <div className={"divider font-bold font-mono text-lg"}>MODEL CONFIG</div>
                    <div className={"flex model-config mb-2 flex-col"}>
                        <label className={"font-mono font-bold"}>openai service</label>
                        <select className={"select select-primary mb-2"} defaultValue={"azure"}>
                            <option value={"azure"}>Azure OpenAI</option>
                            <option value={"openai"}>OpenAI</option>
                        </select>
                        <div className={"flex flex-row max-w-full justify-between flex-wrap"}>
                            <div className={"flex flex-col min-w-2/5 flex-grow lg:mr-2"}>
                                <label className={"font-mono font-bold"}>endpoint:</label>
                                <input {...register("endpoint")} className={"input input-primary"}/>
                            </div>
                            <div className={"flex flex-col flex-grow"}>
                                <label className={"font-mono font-bold"}>key:</label>
                                <input {...register("key")} className={"input input-primary"}/>
                            </div>
                        </div>

                    </div>
                    <div className={"divider font-bold font-mono text-lg"}>TYPE CONFIG</div>
                    <div className={"flex flex-col type-config"}>
                        <label className={"font-mono font-bold"}>typename:</label>
                        <input {...register("typeName")} className={"input input-primary mb-2"}/>
                        <label className={"font-mono font-bold"}>type code:</label>
                        <textarea {...register("schema")} placeholder={"在这里输入type"}
                                  className={"resize-none textarea textarea-primary textarea-lg p-1 mb-2 min-h-[200px]"}/>

                        <label className={"font-mono font-bold"}>query:</label>
                        <textarea {...register("query")} placeholder={"在这里输入自然语言"}
                                  className={"resize-none textarea textarea-primary textarea-lg p-1 mb-2"}/>
                        <input type={"submit"} value={"TypeChat生成"} className={"btn btn-primary"}/>
                    </div>

                </div>
            </form>
            <div className={"divider divider-horizontal"}></div>
            <div className={"output-area bg-amber-300 w-1/2"}>

            </div>
        </div>
    )
}

export default App
