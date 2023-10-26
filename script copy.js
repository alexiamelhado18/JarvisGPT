
// Captura a fala do usuário
const CapturarFala = () => {
    let btnMicrofone = document.querySelector("#microfone");
    let inputDeBusca = document.querySelector("input");

    // Cria um objeto de reconhecimento de fala
    const recognition = new webkitSpeechRecognition();

    // Setando os valores das props do objeto recognition
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;


    btnMicrofone.addEventListener("click", (e) => {
        e.preventDefault(); // Previne o comportamento padrão do botão
        if (recognition.isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // Captura o resultado da fala
    recognition.addEventListener("result", (e) => {
        console.log("entrou no result");
        const result = e.results[0][0].transcript;
        inputDeBusca.value = result;
    });
};

const PerguntarAoJarvis = async (pergunta) => {
    let url = "https://api.openai.com/v1/chat/completions";

    let header = {
        "Content-Type": "application/json",
        "Authorizathon": "Bearer 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"
    };

    let body = {
        "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8DDHyrh4",
        "messages": [
            {
                "role": "system",
                "content": "Jarvis é um chatbot pontual e proátivo"
            },
            {
                "role": "user",
                "content": pergunta
            }
        ],
        "temperature": 0.7
    };

    let options = {
        method: "POST",
        headers: header,
        body: JSON.stringify(body)
    };

    fetch(url, options)
        .then((response) => { return response.json(); })
        .then((data) => { console.log(data); })
        .catch(() => {

        });

};

CapturarFala();