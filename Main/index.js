const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

init();

// display banner 

function init() {

    const logoTxt = "T-Time Employee Manager";

    console.log(
        logo({
            name: logoTxt,
            borderColor: 'magenta',
            logoColor: 'bold-magenta'
        })
        .render()
        );

    // TODO: execute prompts
    //loadPrompts();

}