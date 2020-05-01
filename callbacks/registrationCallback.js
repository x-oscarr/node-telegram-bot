baseCallback = require('./baseCallback');

class RegistrationCallback extends baseCallback{
    constructor(container) {
        super(container);
        this.regex = /^registration\s([a-zA-Z0-9]+)\s?([a-zA-Z0-9]+)?/;
        this.userRepository = container.get('userRepository');
        this.facultyRepository = container.get('facultyRepository');
        this.studentsGroupRepository = container.get('studentsGroupRepository');
        this.mainMenuCallback = container.get('&mainMenu');
        this.userData = {};
        this.KEY_ROLE = 'role';
        this.KEY_FACULTY = 'faculty';
        this.KEY_COURSE = 'course';
        this.KEY_GROUP = 'group';
    }

    async execute(msg, match) {
        const key = match[1];
        const value = match[2];
        this.action('answerCallbackQuery', {callbackQueryId: msg.id});
        this.userData[key] = value;
        switch (key) {
            case this.KEY_ROLE: this.chooseFaculty(msg); break;
            case this.KEY_FACULTY: this.chooseCourse(msg); break;
            case this.KEY_COURSE: this.chooseGroup(msg); break;
            case this.KEY_GROUP: this.final(msg); break;
        }
    }

    async chooseFaculty(msg) {
        const faculties = await this.facultyRepository.findAll();
        const facultiesKeyboard = this.keyboardChunks(faculties, {
            key: this.KEY_FACULTY,
            text: 'abbreviation',
            sizes: [4, 3]
        });
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('start_choose_faculties', msg),
            reply_markup: {inline_keyboard: facultiesKeyboard}
        });
    }

    async chooseCourse(msg) {
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('start_choose_course', msg),
            reply_markup: { inline_keyboard: [
                [
                    {text: 1, callback_data: `registration ${this.KEY_COURSE} 1`},
                    {text: 2, callback_data: `registration ${this.KEY_COURSE} 2`},
                    {text: 3, callback_data: `registration ${this.KEY_COURSE} 3`},
                    {text: 4, callback_data: `registration ${this.KEY_COURSE} 4`}
                ],
                    // Back button
                [
                    {
                        text: this.trans.get('button_back', msg),
                        callback_data: `registration ${this.KEY_ROLE} ${this.userData[this.KEY_ROLE]}`
                    }
                ]
            ]}
        });
    }

    async chooseGroup(msg) {
        const groups = await this.studentsGroupRepository.findBy({
            faculty_id: this.userData[this.KEY_FACULTY],
            course: this.userData[this.KEY_COURSE]
        });
        const groupsKeyboard = this.keyboardChunks(groups, {
            key: this.KEY_GROUP,
            text: 'name',
            sizes: [5,4,3],
            msg
        });
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('start_choose_group', msg),
            reply_markup: {inline_keyboard: groupsKeyboard}
        });
    }

    async final(msg) {
        await this.userRepository.setGroup(msg.from.id, this.userData.group);
        this.action('editMessageText', {
            message_id: msg.message.message_id,
            chat_id: msg.message.chat.id,
            text: this.trans.get('start_registration_final', msg),
        });
    }

    keyboardChunks(items, settings){
        const {text, key, msg, sizes = [6, 5, 4, 3]} = settings;
        // Structure in buttons
        items = items.map(item => {
            return {
                text: key === this.KEY_GROUP ? `${item[text]}-${item.course}${item.number}` : item[text],
                callback_data: `registration ${key} ${item.id}`
            }
        });
        // Count buttons in one line
        let size;
        for(size of sizes) {
            if(items.length % size === 0) {
                break;
            }
        }
        items = this.arrayChunk(items, size ? size : 3);
        // Button back
        if(key === this.KEY_GROUP) {
            const callback_data = `registration ${this.KEY_FACULTY} ${this.userData[this.KEY_FACULTY]}`;
            items.push([{text: this.trans.get('button_back', msg), callback_data}])
        }
        return items;
    }

    arrayChunk(arr, size){
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    }
}

module.exports = RegistrationCallback;