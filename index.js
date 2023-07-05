

    { VK } = require('vk-io'), // библиотека
    { HearManager } = require('@vk-io/hear'),
    { API } = require('vk-io'),
    { Keyboard }= require('vk-io');
    require('dotenv').config();
    console.log(process.env.TOKEN);

const api = new API({
	token: process.env.TOKEN
})

const vk = new VK({
    token: process.env.TOKEN
});
const hearManager = new HearManager();

vk.updates.on('message_new', (context, next) => {
	const { messagePayload } = context;

	context.state.command = messagePayload && messagePayload.command
		? messagePayload.command
		: null;

	return next();
});

vk.updates.on('message_new', hearManager.middleware);

// wrapper for commands
const hearCommand = (name, conditions, handle) => {
	if (typeof handle !== 'function') {
		handle = conditions;
		conditions = [`/${name}`];
	}

	if (!Array.isArray(conditions)) {
		conditions = [conditions];
	}

	hearManager.hear(
		[
			(text, { state }) => (
				state.command === name
			),
			...conditions
		],
		handle
	);
};

// Handle start button
hearCommand('start', (context, next) => {
	context.state.command = 'help';
console.log("started")
	return Promise.all([
		context.send('Путешествия начинаются здесь ✈'),

		next()
	]);
});
hearCommand('restart', (context, next) => {
	context.state.command = 'help';
console.log("started")
	return Promise.all([


		next()
	]);
});


hearCommand('help', async (context) => {
	await context.send({
		message: `Выберите интересующие Вас тему и вопрос

		`,
		keyboard: Keyboard.builder()
        .oneTime()

        .row()
			.textButton({
				label: 'Информация о рейсе ✈',
				payload: {
					command: 'flyinfo'
				},
              color:  Keyboard.POSITIVE_COLOR
			})
			.row()
			.textButton({
				label: 'Транспорт и парковки 🚗',
				payload: {
					command: 'parking'
				},
				color: Keyboard.PRIMARY_COLOR
			})
			.row()
			.textButton({
				label: 'Багаж, досмотр и контроль 🛄',
				payload: {
					command: 'bags'
				},
				color: Keyboard.PRIMARY_COLOR
			})
            .row()
            .urlButton({
                label: 'О перевозке домашних животных🐰',
                url: 'https://pulkovoairport.ru/passengers/animals-plants/'
            })
            .row()
            .urlButton({
                label: 'Перелёты с детьми 👶',
                url: 'https://pulkovoairport.ru/passengers/pulkovo_children/'
            })
            .row()
            .urlButton({
                label: 'FAQ❓',
                url: 'https://pulkovoairport.ru/passengers/faq/'
            })
            .row()
            .urlButton({
                label: 'Важная информация❗',
                url: 'https://pulkovoairport.ru/important/'
            })
            .row()
            .textButton({
				label: 'Больше о нас 👥',
				payload: {
					command: 'more'
				},
				color: Keyboard.PRIMARY_COLOR
			})

	});
});
hearCommand('flyinfo', async (context) => {
	await context.send({message: `Информация о рейсе`,
		keyboard: Keyboard.builder()

        .inline()
            .urlButton({
                label: 'Табло рейсов',
                url: 'https://pulkovoairport.ru/passengers/departure/'
            })
            .row()
            .urlButton({
                label: 'Расписание рейсов',
                url: 'https://pulkovoairport.ru/passengers/destinations/flight_schedule/'
            })
            .row()
            .urlButton({
                label: 'Памятка о регистрации на рейс',
                url: 'https://pulkovoairport.ru/passengers/passenger_registration/'
            })
            .row()
            .textButton({
                label: 'Главное меню',
                payload: {
                    command: 'help'
                }
            })

	});
});
hearCommand('parking', async (context) => {
	await context.send({message: `Транспорт и парковки`,
		keyboard: Keyboard.builder()

        .inline()
            .urlButton({
                label: 'Информация о паркинге',
                url: 'https://pulkovoairport.ru/transport/'
            })
            .row()
            .urlButton({
                label: 'Общественный транспорт',
                url: 'https://pulkovoairport.ru/transport/bus/'
            })
            .row()
            .urlButton({
                label: 'Оплата парковки',
                url: 'https://pulkovoairport.ru/transport/kak-oplatit-parkovku/'
            })
            .row()
            .textButton({
                label: 'Главное меню',
                payload: {
                    command: 'help'
                }
            })

	});
});

hearCommand('bags', async (context) => {
	await context.send({message: `Багаж, досмотр и контроль`,
		keyboard: Keyboard.builder()

        .inline()
            .urlButton({
                label: 'Общая информация о багаже',
                url: 'https://pulkovoairport.ru/passengers/baggage/'
            })
            .row()
            .urlButton({
                label: 'Правила досмотра и контроля',
                url: 'https://pulkovoairport.ru/passengers/security/'
            })
            .row()
            .urlButton({
                label: 'Таможенный контроль',
                url: 'https://pulkovoairport.ru/passengers/security/customs/'
            })
            .row()
            .textButton({
                label: 'Главное меню',
                payload: {
                    command: 'help'
                }
            })

	});
});

hearCommand('more', async (context) => {
	await context.send({message: `Больше о нас`,
		keyboard: Keyboard.builder()

        .inline()
            .urlButton({
                label: 'Telegram',
                url: 'https://t.me/pulkovo_led'
            })
            .row()
            .urlButton({
                label: 'Яндекс.Дзен',
                url: 'http://zen.yandex.ru/id/62289ed35b283f7ef4dd5b31'
            })
            .row()
            .urlButton({
                label: 'OK',
                url: 'https://ok.ru/airportpulkovo'
            })
            .row()
            .urlButton({
                label: 'RUTUBE',
                url: 'https://rutube.ru/channel/24683514/'
            })
            .row()
            .textButton({
                label: 'Главное меню',
                payload: {
                    command: 'help'
                }
            })

	});
});

vk.updates.start()
    .then(() => console.log('Бот запущен!'))
    .catch(console.error);
