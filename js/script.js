var calendar = new Calendar("calendarContainer",         // HTML container ID,                                                                     
                            "small",                     // Size: (small, medium, large)                                                           
                            ["Domingo", 3],               // [ Starting day, day abbreviation length ]                                              
                            [ "#5751d9",                 // Primary Color                                                                          
                              "#5751d9",                 // Primary Dark Color                                                                     
                              "#ffffff",                 // Text Color                                                                            
                              "#ffecb3" ],               // Text Dark Color                                                                        
                            { // Following is optional
                                days: [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta",  "Sabado" ],
                                months: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
                                indicator: true,         // Day Event Indicator                                                                    
                                indicator_type: 1,       // Day Event Indicator Type (0 not to display num of events, 1 to display num of events)  
                                indicator_pos: "bottom", // Day Event Indicator Position (top, bottom)                                             
                                placeholder: "<span>Custom Placeholder</span>"
                            });


function readData(){

    let strData = localStorage.getItem('db');
    let objectData = {};

    if(strData){

        objectData = JSON.parse(strData);

    }else{

        objectData = {

            caronas:[

              {
                date: "2024-06-03",
                hour: "13:00",
                startpoint: "bairro União",
                destination: "UFMG Escola de Medicina",
                driver: "Adriana",
                passenger: "Ricardo"
              },
              {
                date: "2024-06-04",
                hour: "07:00",
                startpoint: "bairro Ouro Preto",
                destination: "UFMG Escola de Arquitetura",
                driver: "Cida",
                passenger: "Rosário"
              },
              {
                date: "2024-06-10",
                hour: "07:00",
                startpoint: "bairro Castelo",
                destination: "PUC São Gabriel",
                driver: "Penha",
                passenger: "Otto"
              },
              {
                date: "2024-06-11",
                hour: "07:00",
                startpoint: "bairro Itapoã",
                destination: "UFMG Campus Pampulha",
                driver: "Sandro",
                passenger: "Gentil Soares"
              },
              {
                date: "2024-06-12",
                hour: "07:00",
                startpoint: "bairro buritis",
                destination: "PUC Coração Eucarístico",
                driver: "Socorro",
                passenger: "Laércio"
              },
              {
                date: "2024-06-12",
                hour: "09:00",
                startpoint: "bairro buritis",
                destination: "PUC Coração Eucarístico",
                driver: "Chayenne",
                passenger: "Ligya"
              },
              {
                date: "2024-05-03",
                hour: "07:00",
                startpoint: "bairro Buritis",
                destination: "PUC Coração Eucarístico",
                driver: "Fabian",
                passenger: "Inácio"
              },
              {
                date: "2024-05-03",
                hour: "13:00",
                startpoint: "PUC Coração Eucarístico",
                destination: "bairro Buritis",
                driver: "Fabian",
                passenger: "Inácio"
              },
              {
                date: "2024-05-10",
                hour: "07:00",
                startpoint: "bairro Itapoã",
                destination: "UFMG Campus Pampulha",
                driver: "Gabriela",
                passenger: "João Pedro"
              },
              {
                date: "2024-05-12",
                hour: "13:00",
                startpoint: "UFMG Escola de Arquitetura",
                destination: "bairro Cidade Nova",
                driver: "Fernanda Miguez",
                passenger: "Gabriel Coelho"
              },
              {
                date: "2024-05-20",
                hour: "18:00",
                startpoint: "bairro Sagrada Família",
                destination: "PUC São Gabriel",
                driver: "Renato",
                passenger: "Henrique"
              },
              {
                date: "2024-05-20",
                hour: "22:00",
                startpoint: "PUC São Gabriel",
                destination: "bairro Sagrada Família",
                driver: "Renato",
                passenger: "Henrique"
              },
              {
                date: "2024-05-15",
                hour: "06:00",
                startpoint: "bairro Belvedere",
                destination: "Ciências Médicas",
                driver: "Joana",
                passenger: "Maria Eliza"
              },
              {
                date: "2024-05-15",
                hour: "11:00",
                startpoint: "Ciências Médicas",
                destination: "bairro Belvedere",
                driver: "Joana",
                passenger: "Maria Eliza"
              },
              {
                date: "2024-05-30",
                hour: "17:00",
                startpoint: "bairro Lourdes",
                destination: "UFMG Escola de Direito",
                driver: "Márcia",
                passenger: "Marcelo"
              },
              {
                date: "2024-05-30",
                hour: "21:00",
                startpoint: "UFMG Escola de Direito",
                destination: "bairro Lourdes",
                driver: "Márcia",
                passenger: "Marcelo"
              },
              {
                date: "2024-05-06",
                hour: "08:00",
                startpoint: "bairro Ouro Preto",
                destination: "PUC Coração Eucarístico",
                driver: "Gabriel Coelho",
                passenger: "Raquel Motta"
              },
              {
                date: "2024-06-20",
                hour: "08:00",
                startpoint: "bairro Ouro Preto",
                destination: "PUC Coração Eucarístico",
                driver: "Gabriel Coelho",
                passenger: "Raquel Motta"
              },
              {
                date: "2024-06-26",
                hour: "06:00",
                startpoint: "bairro Belvedere",
                destination: "Ciências Médicas",
                driver: "Joana",
                passenger: "Maria Eliza"
              },
              {
                date: "2024-06-26",
                hour: "11:00",
                startpoint: "Ciências Médicas",
                destination: "bairro Belvedere",
                driver: "Joana",
                passenger: "Maria Eliza"
              },
              {
                date: "2024-06-08",
                hour: "07:00",
                startpoint: "Bairro Cruzeiro",
                destination: "UFMG Escola de Arquitetura",
                driver: "Vitória Caneloi",
                passenger: "Isadora Esper"
              },
              {
                date: "2024-06-08",
                hour: "12:00",
                startpoint: "UFMG Escola de Arquitetura",
                destination: "Bairro Cruzeiro",
                driver: "Vitória Caneloi",
                passenger: "Isadora Esper"
              },
              {
                date: "2024-05-28",
                hour: "16:00",
                startpoint: "UFMG Campus Pampulha",
                destination: "Bairro Cidade Nova",
                driver: "Raquel",
                passenger: "Mayara"
              }
          
            ]
          
        }
    }

    return objectData;

}

// Call readData function and store the result in a variable
let objectData = readData();

var data = {};

for (i=0; i<objectData.caronas.length; i++){

    // Correctly parse the year from the date string
    let year = parseInt(objectData.caronas[i].date.substring(0, 4)); // Extracts '2024' and converts to integer
    let month = parseInt(objectData.caronas[i].date.substring(5, 7)); 
    let day = parseInt(objectData.caronas[i].date.substring(8, 10));

    let hour = objectData.caronas[i].hour;

    let driver = objectData.caronas[i].driver;
    let passenger = objectData.caronas[i].passenger;

    let startpoint = objectData.caronas[i].startpoint;
    let destination = objectData.caronas[i].destination;

    console.log(year); 
    console.log(month);
    console.log(day);

    // Check if the year exists
    if (!data[year]) {
        data[year] = {};
    }

    // Check if the month exists within the year
    if (!data[year][month]) {
        data[year][month] = {};
    }

    // Check if the day exists within the month
    if (!data[year][month][day]) {
        data[year][month][day] = [];
    }

    const newEntry = {
        startTime: hour,
        endTime: startpoint,
        text: "Motorista: " + driver + " || Passageiro: " + passenger + " || Destino: " + destination
    };

    // Append the new entry to the day's array
    data[year][month][day].push(newEntry);

}


var organizer = new Organizer("organizerContainer", calendar, data);