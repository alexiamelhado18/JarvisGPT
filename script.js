require("dotenv").config();

const OpenAPIKey = process.env.OPENAI.API.KEY;
const AzureAPIKey = process.env.AZURE.API.KEY;

// Captura a fala do usuário
const CapturarFala = () => {
    const btnMicrofone = document.querySelector("#microfone");
    const inputDeBusca = document.querySelector("input");

    //Craindo servico de reconhecimento de fala
    const recognition = new webkitSpeechRecognition();

    // Setando os valores das props do objeto recognition
    recognition.leng = window.navigator.language;
    recognition.interimResults = true;

    btnMicrofone.addEventListener('click', () => {
        //
        recognition.start();
        //desabilita o botao
        btnMicrofone.disabled = true;
        //muda o texto explicativo do input 
        inputDeBusca.placeholder = "Ouvindo..."
        //muda a cor do botao do microfone
        btnMicrofone.style.backgroundColor = 'whitesmoke';
        //muda a cor do ícone
        btnMicrofone.style.color = '#272727'

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputDeBusca.value = transcript;
        };

        // Evento de fim do reconhecimento de fala
        recognition.onend = () => {
            //Habilita o botao
            btnMicrofone.disabled = false;
            //
            recognition.stop();
            //muda a cor do botao do microfone
            btnMicrofone.style.backgroundColor = '#dd203c';
            //muda a cor do ícone
            btnMicrofone.style.color = '#fff';
            //
            PerguntarAoJarvis(inputDeBusca.value);
        };
    });
};

const PerguntarAoJarvis = (pergunta) => {
    let url = "https://api.openai.com/v1/chat/completions";

    let header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPIKey}`
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
        .then((data) => {
            FalarComoJarvis(data.choices[0].message.content)
        })
        .catch(() => {
            console.log("Nao funcionante");
        });

};

const FalarComoJarvis = (texto) => {
    var myHeaders = new Headers();
    myHeaders.append("Ocp-Apim-Subscription-Key", AzureAPIKey);
    myHeaders.append("Content-Type", "application/ssml+xml");
    myHeaders.append("X-Microsoft-OutputFormat", "audio-16khz-128kbitrate-mono-mp3");
    myHeaders.append("User-Agent", "curl");

    var raw = `<speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR'\r\n xml:gender='Female' name='pt-BR-JulioNeural'>${texto}</voice></speak>`;

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
            }
        })
        .then(audioEmTexto => {
            const blob = new Blob([audioEmTexto], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const audioElement = new Audio(audioUrl);
            audioElement.play();
        })
        .catch(error => console.log('error', error));
};

const AtivarJarvis = () => {
    const inputDeBusca = document.querySelector("input");

    // Crie uma instância de SpeechRecognition
    const recognition = new webkitSpeechRecognition();

    // Defina configurações para a instância
    recognition.continuous = true; // Permite que ele continue escutando
    recognition.interimResults = false; // Define para true se quiser resultados parciais

    // Inicie o reconhecimento de voz
    recognition.start();

    // Adicione um evento de escuta para lidar com os resultados
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]; // Último resultado

        // Verifique o texto reconhecido
        const recognizedText = result[0].transcript;

        // Verifique se a palavra "Jarvis" está no texto
        if (recognizedText.toLowerCase().includes('jarvis')) {

            // Comece a salvar a pergunta quando "Jarvis" é detectado
            let array_pergunta = recognizedText.toLowerCase().split('jarvis');
            array_pergunta = array_pergunta[array_pergunta.length - 1];
            inputDeBusca.value = array_pergunta.trim().concat("?");

            if (inputDeBusca != "") {
                PerguntarAoJarvis(array_pergunta);
            }

            // Pare o reconhecimento de voz para economizar recursos
            recognition.stop();
        }
    };

    // Adicione um evento para reiniciar o reconhecimento após um tempo
    recognition.onend = () => {
        setTimeout(() => {
            recognition.start();
        }, 1000); // Espere 1 segundo antes de reiniciar
    };
}

function trocarTema() {
    let temaAtual = document.querySelector("#light-dark").classList;
    let html = document.querySelector("html");


    console.log(html);

    if (temaAtual[1] === "fa-sun") {

        //
        temaAtual.remove("fa-sun");
        //
        temaAtual.add("fa-moon");

        //
        html.style.colorScheme = "dark";
    }
    else {
        //
        temaAtual.remove("fa-moon");
        //
        temaAtual.add("fa-sun");

        //
        html.style.colorScheme = "light";
    }
}

AtivarJarvis();