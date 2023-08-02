import './App.css'
import {createAzureOpenAILanguageModel, createJsonTranslator} from "typechat";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import toast, {Toaster} from 'react-hot-toast';
import CodeEditor from '@uiw/react-textarea-code-editor';

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
        key: '<YourKey>',
        typeName: "Person",
        schema:"export interface Airline{\n" +
            "    datetime: string;\n" +
            "    from: string;\n" +
            "    to: string\n" +
            "}",
        query: "我明天下午2点有个北京到上海的航班",
    });
    const {handleSubmit, register, reset} = useForm({
        defaultValues: formData
    });
    const [output, setOutput] = useState<string>("")
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
        const tId = toast.loading("正在生成，请稍等...");
        localStorage.setItem("formData", JSON.stringify(data));
        // Process requests interactively or from the input file specified on the command line
        const model = createAzureOpenAILanguageModel(data.key, data.endpoint);
        const translator = createJsonTranslator(model, data.schema, data.typeName);

        const response = await translator.translate(data.query);
        if (!response.success) {
            setOutput(response.message);
            toast.dismiss(tId);
            toast.error(response.message);
        } else {
            setOutput(JSON.stringify(response.data, null, 2));
            toast.dismiss(tId);
            toast.success("生成成功");
        }
    }

    return (
        <div className={"main bg-base-200 flex flex-row p-1 w-full min-h-screen"}>
            <Toaster/>
            <form onSubmit={handleSubmit(doTrans)} className={"flex w-1/2  items-center flex-col"}>
                <div className={"flex flex-col w-5/6"}>
                    <div className={"divider font-bold font-mono text-lg mb-1"}>MODEL CONFIG</div>
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
                    <div className={"divider font-bold font-mono text-lg mb-1"}>TYPE CONFIG</div>
                    <div className={"flex flex-col type-config"}>
                        <label className={"font-mono font-bold"}>typename:</label>
                        <input {...register("typeName")} className={"input input-primary mb-2"}/>
                        <label className={"font-mono font-bold"}>type code:</label>
                        {/*<textarea {...register("schema")} placeholder={"在这里输入type"}*/}
                        {/*          className={"resize-none textarea textarea-primary textarea p-1 mb-2 min-h-[200px] "}/>*/}
                        <CodeEditor
                            {...register("schema")}
                            value={formData.schema}
                            language="tsx"
                            placeholder="在这里输入type"
                            // onChange={(e) => {
                            //     setValue("schema", e.target.value)
                            // }}
                            className={"font-mono font-bold border-primary border-[1px] rounded-xl"}
                        >

                        </CodeEditor>
                        <label className={"font-mono font-bold"}>query:</label>
                        <textarea {...register("query")} placeholder={"在这里输入自然语言"}
                                  className={"resize-none textarea textarea-primary textarea p-1 mb-2"}/>
                        <input type={"submit"} value={"TypeChat生成"} className={"btn btn-primary"}/>
                    </div>

                </div>
            </form>
            <div className={"divider divider-horizontal"}>👉👉👉</div>
            <div className={"flex flex-col items-center output-area w-1/2"}>
                <div className={"flex flex-col h-full w-5/6"}>
                    <div className={"divider font-bold font-mono text-lg mb-1"}>OUTPUT</div>
                    <div className={"flex-grow"}>
                        <CodeEditor
                            value={output}
                            language="tsx"
                            placeholder=""
                            // onChange={(e) => {
                            //     setValue("schema", e.target.value)
                            // }}

                            className={"font-mono font-bold min-h-full border-primary border-[1px] rounded-xl"}
                        ></CodeEditor>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
