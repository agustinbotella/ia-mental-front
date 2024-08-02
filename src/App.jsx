import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { Bars } from 'react-loader-spinner'
import { RetellWebClient } from "retell-client-js-sdk";

const retellWebClient = new RetellWebClient();



function App() {
  const [callStatus, setCallStatus] = useState('disconnected')

  const handleCall = async () => {

    if (callStatus === 'loading') {
      return
    }

    if (callStatus === 'connected') {

      //handle finish call
      retellWebClient.stopCall();
      setCallStatus('disconnected')
      return
    }

    setCallStatus('loading')

    // prompt user to allow microphone access
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });


    const token = await fetch('https://ia-mental-back-qcdtp.ondigitalocean.app/get-token/2')
      .then(response => response.json())
      .then(data => data.access_token)

      await retellWebClient.startCall({
        accessToken: token,
      });

      retellWebClient.on("agent_start_talking", () => {
        setCallStatus('connected')
      });

      
  }

  return (
    <>
      <div>
          <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Agente de Salud Mental + IA</h1>
      <h2>Nivel MEDIO</h2>
  
      <div className="card">
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          marginBottom: '20px'
        }}
        >
          {
            callStatus === 'connected' && (<Bars
                  height="40"
                  width="40"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  visible={true}
                />)}
       
        </div>

        <button onClick={() => handleCall()}
          disabled={callStatus === 'loading'}
          >
          { callStatus === 'disconnected' ? 'Iniciar llamada' : callStatus === 'loading' ? 'Iniciando...' : 'Finalizar llamada' }
        </button>
        <p>
          Clickea en el botón para iniciar una llamada.
        </p>
        <p>
          El navegador te solicitara permisos para acceder al microfono. Una vez otorgado el permiso se iniciara la llamada.
        </p>
      </div>
    </>
  )
}

export default App
