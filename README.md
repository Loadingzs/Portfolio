# 💼 Portfólio Maykon Dias — Flask

Portfólio pessoal para apresentar trajetória, habilidades, projetos e contatos. O **Flask** entrega a página principal; **HTML, CSS e JavaScript** cuidam da interface e das interações.

## Recursos presentes

- Seções de apresentação, formação/trajetória, habilidades, projetos, experiência e contato.
- Alternância de tema com preferência salva no navegador.
- Menu para telas menores e navegação entre seções.
- Filtro de projetos por categoria.
- Animações de entrada e barras de habilidades.
- Validação visual do formulário de contato.
- Link para currículo em PDF.

**O formulário simula o envio no JavaScript.** A aplicação Flask possui apenas a rota `/` e não envia mensagens por e-mail.

## Tecnologias

Python · Flask · Flask-CORS · HTML · CSS · JavaScript · Font Awesome · Google Fonts

## Executar localmente

Com Python, pip e Git instalados:

```bash
git clone https://github.com/Loadingzs/Portfolio.git
cd Portfolio
python -m venv .venv
```

Ative o ambiente no PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

No Linux/macOS, use `source .venv/bin/activate`.

```bash
python -m pip install flask flask-cors
python app.py
```

Acesse <http://localhost:5000>. Não é necessário banco de dados.

## Estrutura

```text
Portfolio/
├── app.py
├── templates/
│   └── index.html
└── static/
    ├── Curriculo.pdf
    ├── css/style.css
    └── js/script.js
```

O repositório não inclui `requirements.txt`; o comando de instalação acima corresponde aos imports do back-end.

## Personalizar

| Arquivo | O que editar |
| --- | --- |
| `templates/index.html` | Textos, projetos, links e informações de contato |
| `static/css/style.css` | Cores, tipografia, temas e layout |
| `static/js/script.js` | Filtros, animações, validação e preferências |
| `static/Curriculo.pdf` | Currículo disponível para download |
| `app.py` | Configuração e rotas Flask |

Preserve as expressões `url_for('static', ...)` do template para servir os arquivos pelo Flask.

## Verificar as alterações

1. Abra a página e confira CSS, JavaScript e currículo.
2. Alterne o tema e recarregue para verificar a preferência.
3. Teste o menu em uma janela estreita e os filtros dos projetos.
4. Preencha o formulário e confira as validações; a confirmação é demonstrativa.

Com o ambiente Python ativo e as dependências instaladas, execute os testes de regressão:

```bash
python -m unittest discover -s tests -p "test_*.py" -v
node --test tests/script.test.cjs
```

Os testes Python verificam o link nativo do currículo, o PDF servido pelo Flask e a URL com prefixo de aplicação. O teste JavaScript usa o módulo de testes do Node.js (18 ou superior), sem pacotes adicionais, para verificar o carregamento do script sem um botão com ID específico. Não há envio de e-mails nem servidor público durante os testes.

## Próximos passos

- Implementar o envio real do formulário.
- Registrar as dependências e suas versões.
- Substituir conteúdos de exemplo e revisar os links externos.
- Medir desempenho e acessibilidade antes de divulgar resultados.
- Preparar a publicação com configuração apropriada de chave de sessão, CORS e servidor; `app.py` usa debug no desenvolvimento.

## Licença

O README original declara licença MIT; o arquivo `LICENSE` ainda não está incluído no repositório.

## Autor

**Maykon Dias** · [GitHub](https://github.com/Loadingzs) · [LinkedIn](https://www.linkedin.com/in/maykondias/)
