import React from 'react'
import { Card, FormLabel, CardContent } from '@material-ui/core/'
import { EmailShareButton, WhatsappShareButton } from "react-share";
import firebase from '../firebase'
import '../styles/lista.css'

class ListaDados extends React.Component {

    state = {
        dados: []
    }

    compartilhar = e => {
        console.log(e.target.id)
    }

    componentDidMount() {
        this.buscaDados()
    }

    buscaDados = () => {
        let context = this
        firebase
            .database()
            .ref('Dados/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    let s = Object.values(snapshot.val())
                    context.setState({ dados: s })
                }
            })
    }
    4
    render() {
        return (
            <div>
                {
                    this.state.dados.map((i, index) => {
                        return (
                            <Card id="card-dado" key={index}>
                                <CardContent>
                                    <div id="card-descricao">
                                        <FormLabel id="nome-arquivo">{i.nome}</FormLabel>
                                        <FormLabel id="data-arquivo">{`Data:${i.data}`}</FormLabel>
                                        <FormLabel id="data-arquivo">{`Descrição:${i.descricao}`}</FormLabel>
                                    </div>
                                    <div id="card-url">
                                        <FormLabel id="url-arquivo">{i.url}</FormLabel>
                                        <div>
                                            <div className="icone">
                                                <EmailShareButton id="share" style={{ background: '#1e1e1e' }} url={i.url} round={true} size={50} />
                                                <FormLabel>Email</FormLabel>
                                            </div>
                                            <div className="icone">
                                                <WhatsappShareButton id="share" url={i.url} style={{ background: 'green' }} round={true} size={50} />
                                                <FormLabel>Whatsapp</FormLabel>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>
        )
    }
}

export default ListaDados