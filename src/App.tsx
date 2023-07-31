import './App.css'
import {createJsonTranslator, createLanguageModel, processRequests} from "typechat";
import * as process from "process";
import * as fs from "fs";
import {dirname,join} from "path-browserify";
import {TodoResponse} from "./types.tsx";
import {useForm} from "react-hook-form";
import {config} from "dotenv"

const __dirname = dirname("./");
config({path: join(__dirname, "../.env")})

function App() {
    const {handleSubmit, register} = useForm();

    const model = createLanguageModel(process.env);

    const schema = fs.readFileSync(join(__dirname, "types.tsx"), "utf8");

    const translator = createJsonTranslator<TodoResponse>(model, schema, "TodoResponse");

    const doTrans = () => {
        // Process requests interactively or from the input file specified on the command line
        processRequests("😀> ", process.argv[2], async (request) => {
            const response = await translator.translate(request);
            if (!response.success) {
                console.log(response.message);
                return;
            }
            console.log(`The sentiment is ${response.data}`);
        });
    }

    return (
        <div className={"main bg-base-200 flex flex-col justify-center w-full h-screen "}>
            <form onSubmit={handleSubmit(doTrans)} className={"flex flex-col justify-center"}>
                <div className={"flex flex-row justify-evenly mb-2"}>
                    <textarea {...register("type")} placeholder={"在这里输入type"}
                              className={"resize-none textarea textarea-lg p-1"}/>
                    <div className={"flex flex-col items-center"}>
                        <div className={"submit-btn flex h-full items-center"}>
                            👉
                            <input type={"submit"} value={"TypeChat生成"} className={"btn btn-primary"}/>
                            👈
                        </div>
                        👇
                    </div>
                    <textarea {...register("query")} placeholder={"在这里输入自然语言"}
                              className={"resize-none textarea textarea-lg p-1"}/>
                </div>
            </form>
        </div>
    )
}

export default App
