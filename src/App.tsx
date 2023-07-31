import './App.css'

function App() {

    return (
        <div className={"main bg-base-200 flex flex-col justify-center w-full h-screen "}>
            <form className={"flex flex-col justify-center"}>
                <div className={"flex flex-row justify-evenly mb-2"}>
                    <textarea placeholder={"在这里输入type"} className={"resize-none textarea textarea-lg p-1"}/>
                    <div className={"flex flex-col items-center"}>
                        <div className={"submit-btn flex h-full items-center"}>
                            👉
                            <input type={"submit"} value={"TypeChat生成"} className={"btn btn-primary"}/>
                            👈
                        </div>
                        👇
                    </div>
                    <textarea placeholder={"在这里输入自然语言"} className={"resize-none textarea textarea-lg p-1"}/>
                </div>
            </form>
        </div>
    )
}

export default App
