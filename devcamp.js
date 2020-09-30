const env = require('./.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { enter } = Stage
const { getPalestrasDia, getPalestra } = require('./devcampServices')
;


//********************** Teclados convencionais **********************/
const tecladoTrilhas = Markup.keyboard([ 
    ['DevRoots'],
    ['Data Track'],
    ['Além do Código'],
    ['Business Performance']
]).resize().extra()

const botoesPalestras = palestras => {
    const botoes = palestras.map(item => {
        return [Markup.callbackButton(`${item.tema} - ${item.palestrante}`)]
    })
    return Extra.markup(Markup.keyboard(botoes))
}

//********************** Wizards **********************/

//******** DevRoots *********/
const wizardDevRoots = new WizardScene('devroots',
    async ctx => {
        const palestras = await getPalestrasDia('2020-09-22')
        ctx.reply('Aí sim, hein!? Já pega o café e bora aprender e codar! ')
        ctx.reply('Escolha um dos temas abaixo para assistir a palestra. Basta clicar sobre a opção desejada.', botoesPalestras(palestras))
        ctx.wizard.next()
    }
)

//******** Data Track *********/
const wizardDataTrack = new WizardScene('datatrack',
    async ctx => {
        const palestras = await getPalestrasDia('2020-09-23')
        ctx.reply('Boooa! A ciência de dados deu margem para uma verdadeira revolução, não íamos ficar fora dessa, né?')
        ctx.reply('Escolha um dos temas abaixo para assistir a palestra. Basta clicar sobre a opção desejada.', botoesPalestras(palestras))
        ctx.wizard.next()
    }
)

//******** Além do Código *********/
const wizardAlemDoCodigo = new WizardScene('alemdocodigo',
    ctx => {
        
        ctx.reply('Ok! Então você está procurando por móveis?')
        ctx.reply('Digite parte do nome do móvel que você busca e eu irei checar no nosso estoque')
        ctx.wizard.next()
    }
)

//******** Business Performance *********/
const wizardBusinessPerformance = new WizardScene('businessperformance',
    ctx => {
       
        ctx.reply('Ok! Então você está procurando por móveis?')
        ctx.reply('Digite parte do nome do móvel que você busca e eu irei checar no nosso estoque')
        ctx.wizard.next()
    }
)

//********************** Configuração do Bot **********************/
const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name}!`)
    ctx.replyWithHTML('Eu sou o DevCamp Bot 🤖 e vou trazer pra você tudo que rolou no DevCamp 2020.' 
    + '\nO evento foi totalmente online e gratuito e contou com trilhas iradas!'
    + '\nEu vou te dizer um pouco do que é cada trilha, assim você escolhe o que quer assistir primeiro, tá?'
    + '\n'
    + '\nVamos lá:'
    + '\n'
    + '\n<b>DevRoots:</b> <i>Conteúdos técnicos e aprendizado na prática. Mão no massa!</i>'
    + '\n'
    + '\n<b>Data Track:</b> <i>Sobre Big Data e Machine Learning e como essa dupla anda revolucionando o mercado. Veja alguns cases.</i>'
    + '\n'
    + '\n<b>Além do Código:</b> <i>Aqui o assunto é gestão de equipes e processos, ferramentas e metodologias para ir além do código.</i>'
    + '\n'
    + '\n<b>Business Performance:</b> <i>A jornada tecnológica do cliente, resultados acelerados e aumento de valor do negócio.</i>'
    + '\n'
    + '\n'
    + '\nDeu vontade, né? Por onde você quer começar?', tecladoTrilhas)
})

//******** Define qual a palestra que será renderizada *********/
bot.hears(/(Plt\w*)/, async ctx => {
    const palestra = await getPalestra(ctx.match[1])
    await ctx.reply(`Curta seu vídeo: ${palestra[0].link}`)
})

const stage = new Stage([wizardDevRoots, wizardDataTrack, wizardAlemDoCodigo, wizardBusinessPerformance])

bot.use(session())
bot.use(stage.middleware())

bot.hears('DevRoots', enter('devroots'))
bot.hears('Data Track', enter('datatrack'))
bot.hears('Além do Código', enter('alemdocodigo'))
bot.hears('Business Performance', enter('businessperformance'))

bot.on('message', ctx => ctx.reply('Entre com uma das opções...', tecladoTrilhas))

bot.startPolling()