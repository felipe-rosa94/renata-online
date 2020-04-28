import React from 'react'

import { AppBar, Card, CircularProgress, FormLabel, TextField, Input, Toolbar, Typography, CardContent } from '@material-ui/core/'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ListaDados from '../components/ListaDados'
import firebase from '../firebase'
import '../styles/home.css'

class Home extends React.Component {

    state = {
        porcentagem: '',
        descricao: ''
    }

    handleInputs = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleArquivo = (e) => {
        if (e.target.files[0]) {
            const arquivo = e.target.files[0]
            const { name, type } = e.target.files[0]
            this.uploadArquivo(arquivo, name, type)
        }
    }

    uploadArquivo(arquivo, name, type) {
        let context = this
        context.setState({ progress: true })
        let key = this.key()
        let uploadTask = firebase.storage().ref(`${type}/${key}-${name}`).put(arquivo)

        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            let porcentagem = `${progress.toFixed(0)}%`
            context.setState({ porcentagem: porcentagem })
        }, function (error) {
            alert(error)
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                context.gravarBanco(key, downloadURL, name)
                context.setState({ porcentagem: 'Pronto', progress: false })
            })
        })
    }

    gravarBanco = (key, url, nome, ) => {
        let json = {
            key: key,
            nome: nome,
            descricao: this.state.descricao,
            url: url,
            data: this.data()
        }

        let context = this
        firebase.database().ref(`Dados/${key}`)
            .set(json)
            .then((data) => {
                context.limpa()
            }).catch((error) => {
                console.log('error ', error)
            });
    }

    limpa = () => {
        this.setState({ progress: false, porcentagem: '', descricao: '' })
        alert('Arquivo salvo com sucesso.')
    }

    key = () => {
        let hora = new Date()
        return hora.getTime()
    }

    data = () => {
        let data = new Date()
        let year = data.getUTCFullYear()
        let mouth = (data.getUTCMonth() + 1).toString()
        let day = data.getUTCDate().toString()
        mouth = mouth.length === 1 ? '0' + mouth : mouth
        day = day.length === 1 ? '0' + day : day
        return `${day}-${mouth}- ${year}`
    }

    componentDidMount() {
        this.autenticacao()
    }

    autenticacao = () => {
        let usuario = sessionStorage.getItem('renata-online:login')
        usuario = usuario === null ? false : JSON.parse(usuario)
        if (!usuario.login) {
            this.props.history.replace('/')
        }
    }

    render() {
        const theme = createMuiTheme({
            palette: {
                secondary: {
                    main: '#f48fb1'
                }
            },
        });
        return (
            <div id="container">
                <div id="main">
                    <MuiThemeProvider theme={theme}>
                        <AppBar position="sticky" color="secondary">
                            <Toolbar>
                                <Typography variant="h6" noWrap style={{ color: 'white' }}>
                                    Renata Online
                        </Typography>
                            </Toolbar>
                        </AppBar>
                    </MuiThemeProvider>


                    <Card style={{ margin: 4 }}>
                        <CardContent>
                            <Typography variant="h6" noWrap>
                                Salvar arquivos na nuvem
                            </Typography>
                            <TextField margin="dense" name="descricao" label="Descrição" type="text" fullWidth variant="outlined" onChange={this.handleInputs} />
                            <Input type="file" fullWidth={true} onChange={this.handleArquivo}></Input>
                            <div className="progress">
                                {
                                    this.state.progress &&
                                    <CircularProgress size={30} />
                                }
                                <FormLabel id="porcentagem">{this.state.porcentagem}</FormLabel>
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ marginTop: 16 }}>
                        <CardContent>
                            <Typography variant="h6" noWrap>
                                Lista de arquivos salvos
                            </Typography>
                            <ListaDados />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Home