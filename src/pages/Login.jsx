import React from 'react'
import { withRouter } from 'react-router-dom'
import { TextField, Button, FormLabel } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import firebase from '../firebase'
import '../styles/login.css'

class Login extends React.Component {

    state = {}

    handleInputs = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    entrar = () => {
        const { email, senha, pagina } = this.state
        firebase.auth()
            .signInWithEmailAndPassword(email, senha)
            .then(function (result) {
                let usuario = {
                    email: email,
                    senha: senha,
                    login: true
                }
                sessionStorage.setItem('renata-online:login', JSON.stringify(usuario))
                pagina.replace('/home')
            })
    }

    componentDidMount() {
        this.setState({
            pagina: this.props.history
        })
    }

    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#f8bbd0'
                }
            },
        })

        return (
            <div id='content-login'>
                <div id='main-login'>
                    <MuiThemeProvider theme={theme}>
                        <div className='login'>
                            <FormLabel id='titulo-login'>Login Renata Online</FormLabel>
                        </div>
                        <div className='login'>
                            <TextField variant="outlined" type="text" name="email" color="primary" label="Usuário" placeholder="Usuário" fullWidth={true} onChange={this.handleInputs} />
                        </div>
                        <div className='login'>
                            <TextField variant="outlined" type="password" name="senha" color="primary" label="Senha" placeholder="Senha" fullWidth={true} onChange={this.handleInputs} />
                        </div>
                        <div className='login'>
                            <Button onClick={this.entrar}>Entrar</Button>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)