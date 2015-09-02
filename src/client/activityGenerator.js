import log from '../shared/utils/logTailor';
import actionCreators from '../shared/actionCreators';
import {generateOnePseudo} from '../shared/utils/pseudosGenerator';
import {randomInteger, randomString, randomText} from '../shared/utils/randomGenerators';

let getState, dispatch;
const activeNames = [];
const names = ['Christian', 'Donald', 'Faith', 'Erica', 'Stella', 'Quinn', 'Apollo', 'Cohen', 'Bruno', 'Tommy', 'Erin', 'Samuel', 'Walker', 'Clara', 'Karla', 'Ronald', 'Hunter', 'Kody', 'Dahlia', 'Phoebe', 'Jonathon', 'Bennett', 'Rivka', 'Kaeden', 'Lewis', 'Meredith', 'London', 'Scott', 'Kiera', 'Catalina', 'Ronnie', 'Melissa', 'Avery', 'Cynthia', 'Danica', 'Kristina', 'Elisa', 'Evan', 'Nasir', 'Norah', 'Rosemary', 'Laney', 'Kamryn', 'Janessa', 'Hailee', 'Kareem', 'Natasha', 'Greyson', 'Israel', 'Cecelia', 'Rocco', 'Jessie', 'Lane', 'Tegan', 'Leyla', 'Carmelo', 'Alaina', 'Heaven', 'Devon', 'Kyra', 'Josue', 'Rhys', 'Davin', 'Ali', 'Kennedy', 'Andres', 'Anna', 'Alfredo', 'Rayan', 'Janelle', 'Kai', 'August', 'Ahmad', 'Kathryn', 'Rowan', 'Elian', 'Fletcher', 'Philip', 'Susan', 'Cora', 'Keira', 'Cedric', 'Kyleigh', 'Hugh', 'Dorian', 'Nova', 'Austin', 'Heidi', 'Johan', 'Aryana', 'Abraham', 'Augustine', 'Remi', 'Noe', 'Alessandra', 'Adelina', 'Mara', 'Richard', 'Hallie', 'Tatum', 'Jaxon', 'Karen', 'Alondra', 'Hank', 'Mustafa', 'Morgan', 'Marissa', 'Landon', 'Cristiano', 'Anderson', 'Terry', 'Mira', 'Graham', 'Zoie', 'Lisa', 'Dakota', 'Kaylynn', 'Jayson', 'Kenzie', 'Jonas', 'Dennis', 'Desiree', 'Caitlyn', 'Branson', 'Jimmy', 'Dana', 'Marlee', 'Adrianna', 'Corbin', 'Gavin', 'Ainsley', 'Gracie', 'Caitlin', 'Major', 'Mckayla', 'Jaime', 'Alia', 'Nola', 'Eliza', 'Wilson', 'Keaton', 'Linda', 'Mae', 'Izabella', 'Rafael', 'Raiden', 'Melvin', 'Kyle', 'Dillon', 'Jayla', 'Javier', 'Leon', 'Hezekiah', 'Jaxson', 'Serenity', 'Macy', 'Barrett', 'Ariel', 'Addyson', 'Vincent', 'Silas', 'Gerald', 'Celine', 'Aiden', 'Noemi', 'Molly', 'Tessa', 'Alisa', 'Victor', 'Jazmine', 'Emanuel', 'Noa', 'Frida', 'Mason', 'Oliver', 'Joyce', 'Camilla', 'Bailee', 'Rudy', 'Issac', 'Harper', 'Natalya', 'Cassidy', 'Daphne', 'Emma', 'Saul', 'Alexis', 'Yael', 'Kathleen', 'Jerome', 'Carmen', 'Maci', 'Madisyn', 'Danielle', 'Gordon', 'Sky', 'Axel', 'Zeke', 'Caden', 'Carly', 'Ahmed', 'Edison', 'Kassidy', 'Eduardo', 'Anabelle', 'Roger', 'Jace', 'Emery', 'Lily', 'Walter', 'Pablo', 'Giovanna', 'Maximo', 'Jackson', 'Hudson', 'Zackary', 'Jadon', 'Sidney', 'Kingston', 'Kylie', 'Erika', 'Bo', 'Myles', 'Darien', 'Angelo', 'Kade', 'Marley', 'Juliana', 'Hanna', 'Eliseo', 'Josie', 'Jay', 'Madalyn', 'Melany', 'Darrell', 'Valerie', 'Leo', 'Franklin', 'Cambria', 'Gael', 'Billy', 'Enrique', 'Alexandria', 'Ruth', 'Tiffany', 'Eden', 'Selah', 'Gracelyn', 'Amir', 'Aaliyah', 'Elaina', 'Brayden', 'Trey', 'Willow', 'Libby', 'Nayeli', 'Janae', 'Anne', 'Finley', 'Jaydon', 'Patricia', 'Salvador', 'Isla', 'Emery', 'Anders', 'Kaden', 'Bryan', 'Reese', 'Colby', 'Donovan', 'Greta', 'Benson', 'Jennifer', 'Ivory', 'Livia', 'Lea', 'Leighton', 'Milan', 'Joe', 'Arabella', 'Clay', 'Alicia', 'Shelby', 'Gilbert', 'Miracle', 'Micah', 'Samir', 'Carolyn', 'Kiara', 'Adeline', 'Angela', 'Koen', 'Jaylin', 'Mattie', 'Wesley', 'Jamal', 'Aurelia', 'Ezequiel', 'Reed', 'Andrew', 'Juniper', 'Anya', 'Caleb', 'Leona', 'Eliana', 'Phillip', 'Clare', 'Larry', 'Lorelei', 'Khalid', 'Kai', 'Genevieve', 'Sydney', 'Itzel', 'Dominique', 'Matilda', 'Breanna', 'Max', 'Brielle', 'Cherish', 'Albert', 'Dominick', 'Ashton', 'Cooper', 'Terrell', 'Gregory', 'Terrance', 'Porter', 'Selena', 'Gary', 'America', 'Zion', 'Cayden', 'Mabel', 'Kelly', 'Barbara', 'Emmet', 'Joy', 'Chandler', 'Luis', 'Matias', 'Lilith', 'Chaya', 'Harmony', 'Prince', 'Amelie', 'Enzo', 'Nathanael', 'Marianna', 'Jaiden', 'Wynter', 'Cassandra', 'Raquel', 'Kieran', 'Rhett', 'Bella', 'Jason', 'Amaya', 'Elise', 'Johnathan', 'Anika', 'Emely', 'Lance', 'Veronica', 'Sophia', 'Mckenna', 'Gianni', 'Elijah', 'Angie', 'Tristan', 'Kaylee', 'Estelle', 'Jamie', 'Paul', 'Everett', 'Milana', 'Caiden', 'Mayson', 'Paula', 'Kira', 'Kenya', 'Elias', 'Chanel', 'Lionel', 'Raul', 'Colette', 'Jesus', 'Corinne', 'Aliyah', 'Sage', 'Skylar', 'Keith', 'Eli', 'Anakin', 'Xavier', 'Korbin', 'Jordan', 'Ivanna', 'Luka', 'Joel', 'Kaiden', 'Raina', 'Erick', 'Louis', 'Mauricio', 'Liberty', 'Marisol', 'Madelyn', 'Elena', 'Ruby', 'Johnathon', 'Jaden', 'Alden', 'Raphael', 'Allan', 'Phoenix', 'Astrid', 'Archer', 'Jolene', 'Brianna', 'Adan', 'Adele', 'Diego', 'Paris', 'Ephraim', 'Lamar', 'Sloan', 'Kiley', 'Lucy', 'Judah', 'Dimitri', 'Tabitha', 'Ariadne', 'Kayla', 'Stefan', 'Valeria', 'Jakob', 'Nikolas', 'Gwendolyn', 'Alexander', 'Clementine', 'Titus', 'Bethany', 'Maddison', 'Cameron', 'Sofia', 'Eliezer', 'Zaria', 'Fabian', 'Justice', 'Kylee', 'Adam', 'Angeline', 'Santino', 'Luna', 'Kailee', 'Nicolas', 'Royal', 'Dallas', 'Ryan', 'Jacqueline', 'Will', 'Guadalupe', 'Jalen', 'Kendra', 'Paola', 'Isabel', 'Carter', 'Leonard', 'Soren', 'Jorge', 'Kaydence', 'Simone', 'Katherine', 'Allen', 'Valentina', 'Roman', 'Peter', 'Bryson', 'Elyse', 'Brodie', 'Dulce', 'Amina', 'Zavier', 'Kinley', 'Lena', 'Mila', 'Monica', 'Haylee', 'Hassan', 'Priscilla', 'Valentino', 'Jared', 'Jaycob', 'Lennon', 'Lola', 'Aurora', 'Blaze', 'Emmalyn', 'Lee', 'Stephanie', 'Noel', 'Quintin', 'Ryder', 'Chase', 'Gemma', 'Beau', 'Jade', 'Julien', 'Zion', 'Quincy', 'Kamryn', 'Esteban', 'Bryn', 'Catherine', 'Zara', 'Savannah', 'Aniya', 'Ryan', 'Hayley', 'Ann', 'Patrick', 'Sarah', 'Kristen', 'Blair', 'Malakai', 'Tyrone', 'Ashley', 'Shane', 'Abdullah', 'Jenna', 'Sariah', 'Esmeralda', 'Salma', 'Asher', 'Nathaniel', 'Zachariah', 'Peyton', 'Connor', 'Scarlet', 'Warren', 'Theodore', 'Mia', 'Emilee', 'Danny', 'Reece', 'Eileen', 'Rex', 'Annika', 'Kayden', 'Ryann', 'Maximiliano', 'Lilyana', 'Ty', 'Rodrigo', 'Camryn', 'Wayne', 'Reese', 'Felipe', 'Isaiah', 'Joaquin', 'Marilyn', 'Laila', 'Serena', 'Angelique', 'Karina', 'Sara', 'Charlie', 'Kenna', 'Marcus', 'Cole', 'Renee', 'Luke', 'Perla', 'Audrey', 'Beckett', 'Lucia', 'Ashlyn', 'Allyson', 'Trevor', 'Aron', 'Alanna', 'Ariana', 'Mercy', 'Rogelio', 'Makayla', 'Deandre', 'Alannah', 'Hazel', 'Makenzie', 'Alma', 'Skye', 'Calvin', 'Azalea', 'Judith', 'Riya', 'Cecilia', 'Tatiana', 'Remy', 'Christopher', 'Duke', 'Josephine', 'Harlan', 'Kyla', 'Lainey', 'Monroe', 'Zechariah', 'Tyler', 'Channing', 'Corey', 'Elisha', 'Evangeline', 'Jaylen', 'Markus', 'Ariella', 'Marvin', 'Nicole', 'Aimee', 'River', 'Matteo', 'Kiana', 'Esme', 'Marley', 'Cyrus', 'Skyler', 'Mohammed', 'Arianna', 'Bentley', 'Johanna', 'Malik', 'Colten', 'Aubree', 'Patience', 'Abel', 'Ernest', 'Niko', 'Alfred', 'Melody', 'Sergio', 'Jeffrey', 'Heath', 'Jude', 'Justin', 'Logan', 'Rylee', 'Forrest', 'Lyla', 'Trinity', 'Iker', 'Katelynn', 'Mallory', 'Zahra', 'Ismael', 'Cade', 'Celeste', 'Triston', 'Alvin', 'Clayton', 'Winston', 'Clarissa', 'Antonio', 'Trace', 'Anson', 'Collin', 'Henry', 'Giselle', 'Kaelyn', 'Luciano', 'Denise', 'Cory', 'Bailey', 'Luciana', 'Rylie', 'Ray', 'Stanley', 'Kendall', 'Finley', 'Milena', 'Sam', 'Maisie', 'Athena', 'Christine', 'Aria', 'Holden', 'Jayden', 'Reina', 'Lexie', 'Adalynn', 'Jake', 'Nash', 'Luca', 'Lilliana', 'Mikaela', 'Brooke', 'Martha', 'Camden', 'Lacey', 'Alayna', 'Alonso', 'Dane', 'Leilani', 'Maria', 'Terrence', 'Flynn', 'Belen', 'Lachlan', 'Colton', 'Alissa', 'Jamison', 'Sonia', 'Edward', 'Kian', 'Ada', 'Olivia', 'Michaela', 'Rosalyn', 'Aidan', 'Emily', 'Diamond', 'Carla', 'Hadassah', 'Kora', 'Hamza', 'Mariam', 'Julius', 'Gideon', 'Amos', 'Wyatt', 'Annalise', 'Maleah', 'Cadence', 'Julianna', 'Rolando', 'Amelia', 'Ricky', 'Nala', 'Uriel', 'Kaia', 'Dilan', 'Virginia', 'Levi', 'Casey', 'Annie', 'Grey', 'Darian', 'Haley', 'Cody', 'Tristen', 'Charles', 'Lara', 'Brendan', 'Jonathan', 'Sarai', 'Gloria', 'Fernando', 'Weston', 'Lucille', 'Brooklyn', 'Raven', 'Gia', 'Miles', 'Amirah', 'Rene', 'Daniel', 'Lauren', 'Arthur', 'Taylor', 'Nia', 'Blaise', 'Arjun', 'Halle', 'Elisabeth', 'Brennan', 'River', 'Maurice', 'Kevin', 'Lindsey', 'Mercedes', 'Lindsay', 'Cheyenne', 'Harvey', 'Danika', 'Clyde', 'Caroline', 'Frances', 'Anthony', 'Michael', 'Jericho', 'Dorothy', 'Draven', 'Riley', 'Aldo', 'Jonah', 'Casey', 'Mollie', 'Ethan', 'Jair', 'Rayna', 'Adalyn', 'Jazmin', 'Maximus', 'Camille', 'Milo', 'Miley', 'Junior', 'Braden', 'Zaire', 'Ares', 'Nina', 'Tanner', 'London', 'Atlas', 'Madison', 'Parker', 'Emmeline', 'Damien', 'Evie', 'Marina', 'Jazlyn', 'Gustavo', 'Neil', 'Ayden', 'Stevie', 'Claudia', 'Whitney', 'Kayleigh', 'Katelyn', 'Bridget', 'Maximilian', 'Mohamed', 'Talia', 'Paisley', 'Bryant', 'Agustin', 'Thomas', 'Penelope', 'June', 'Pearl', 'Brandon', 'Estrella', 'Kyler', 'Talon', 'Annabel', 'Alan', 'Gino', 'Mina', 'Braxton', 'Myra', 'Freya', 'Harrison', 'Elliot', 'Ashlynn', 'Harper', 'Eve', 'Jeffery', 'Lyric', 'Lyric', 'Nathan', 'Augustus', 'Rosie', 'Amalia', 'Pedro', 'Sean', 'Elle', 'Benton', 'Ava', 'Nathalie', 'Carson', 'Steve', 'Travis', 'Olive', 'Thalia', 'Maeve', 'Maya', 'Foster', 'Bianca', 'Martin', 'Zachary', 'Leanna', 'Ireland', 'Cash', 'Mateo', 'Arielle', 'Sebastian', 'Brent', 'Nancy', 'Dario', 'Jordyn', 'Sylvia', 'Craig', 'Asa', 'Laurel', 'Moshe', 'Magdalena', 'Rashad', 'Parker', 'Simon', 'Ean', 'Cameron', 'Emory', 'Margaret', 'Jocelyn', 'Rory', 'Lucian', 'Brooklynn', 'Samara', 'Alejandro', 'Lucas', 'Rose', 'Lesly', 'Jett', 'Killian', 'Liv', 'Jaylee', 'Sloane', 'Gerardo', 'Daniela', 'Violet', 'Damian', 'Dax', 'Karlee', 'Joseph', 'Miriam', 'Teagan', 'Kaitlyn', 'Annabella', 'Bradley', 'Raymond', 'Gabrielle', 'Ian', 'Isabelle', 'Iliana', 'Taryn', 'Duncan', 'Ciara', 'Alana', 'Francesca', 'Emmett', 'Kate', 'Amira', 'Hannah', 'Nico', 'Farrah', 'Neriah', 'Ramon', 'Brice', 'Kayden', 'Kelsey', 'Vivienne', 'Amanda', 'Osvaldo', 'Brody', 'Jillian', 'Anabella', 'Desmond', 'Dalia', 'Enoch', 'Kolby', 'Finn', 'Liana', 'Mathias', 'Jimena', 'Alonzo', 'Declan', 'Adelaide', 'Carter', 'Vanessa', 'Iris', 'Maxim', 'Nevaeh', 'Alison', 'Rodney', 'Lawrence', 'Marco', 'Alejandra', 'Paulina', 'Claire', 'Tara', 'Bobby', 'Hayden', 'Emilia', 'Ella', 'Lana', 'Matthias', 'Lila', 'Emmy', 'Sterling', 'Peyton', 'Maryam', 'Esther', 'Dustin', 'Lukas', 'Delilah', 'Helena', 'Arturo', 'Leif', 'Randy', 'Julio', 'Mathew', 'Sasha', 'Zane', 'Katie', 'Keenan', 'Blake', 'Alex', 'Brenden', 'Nehemiah', 'Kale', 'Santos', 'Layne', 'Jameson', 'Payton', 'Layton', 'Hayden', 'Kaleb', 'Emory', 'Lina', 'Darius', 'Lennon', 'Drew', 'Rachel', 'Mario', 'Reagan', 'Curtis', 'Oscar', 'Isis', 'Layla', 'Chloe', 'Robert', 'Konnor', 'Colin', 'Steven', 'Alexa', 'Imani', 'Ramiro', 'Vaughn', 'Monserrat', 'Noah', 'Elaine', 'Amy', 'Uriah', 'Rowan', 'Hunter', 'Truman', 'Franco', 'Magnus', 'Alberto', 'Braeden', 'Cassius', 'Emilie', 'Thiago', 'Josiah', 'Kendrick', 'Isabela', 'Adelyn', 'Mikayla', 'Gabriel', 'Troy', 'Callum', 'Mckenzie', 'Omar', 'Aisha', 'Blake', 'Annalee', 'Vincenzo', 'Melanie', 'Toby', 'Baylee', 'Shawn', 'Sienna', 'Gianna', 'Gabriela', 'Kane', 'Lauryn', 'Estella', 'Skyler', 'Sadie', 'Tatum', 'Anastasia', 'Kamila', 'Elliott', 'Adonis', 'Alexis', 'Dean', 'Melina', 'Lydia', 'Felicity', 'Alivia', 'Skylar', 'Finnegan', 'Azaria', 'Coleman', 'Abram', 'Garrett', 'Jaylene', 'Joey', 'Meadow', 'Mike', 'Jessa', 'Jaida', 'Benjamin', 'Julia', 'Milan', 'Emerson', 'Reid', 'Madilyn', 'Kailyn', 'Odin', 'Lilly', 'Xzavier', 'Kobe', 'Presley', 'Danna', 'Jasmin', 'Jesse', 'Zain', 'Jordan', 'Angel', 'Aubrey', 'Cruz', 'Brady', 'Nicholas', 'Alvaro', 'Mackenzie', 'Rylan', 'Abby', 'Penny', 'Dalton', 'Solomon', 'Randall', 'Griffin', 'Ulises', 'Dawson', 'Paige', 'Xander', 'Guillermo', 'Helen', 'Millie', 'Jon', 'Marie', 'Zoe', 'Samson', 'Aylin', 'Braiden', 'Mya', 'Christina', 'Natalia', 'Jamie', 'Cesar', 'Brenna', 'Beatrice', 'Lawson', 'Adriana', 'Paxton', 'Dakota', 'Chelsea', 'Celia', 'Drake', 'Mark', 'Fatima', 'Sierra', 'Andy', 'Lexi', 'Yousef', 'Tori', 'Kristopher', 'Braylon', 'Henrik', 'Margot', 'Eva', 'Orion', 'Diana', 'Knox', 'Salvatore', 'Ford', 'Brynn', 'Kingsley', 'Ace', 'Haven', 'Victoria', 'Joshua', 'Edgar', 'Savanna', 'Riley', 'Jane', 'Ezra', 'Ronan', 'Amani', 'Scarlett', 'Shaun', 'Hailey', 'Isaac', 'Julianne', 'Megan', 'Dallas', 'Jasmine', 'Ben', 'Londyn', 'Georgia', 'Ximena', 'Roselyn', 'Michelle', 'Francis', 'Leland', 'Rosa', 'Tucker', 'James', 'Sonny', 'Abigail', 'Waylon', 'Grady', 'Rocky', 'Johnny', 'Juan', 'Sawyer', 'Destiny', 'Moses', 'Clinton', 'Hope', 'Taylor', 'Jeremiah', 'Pierce', 'Harlow', 'Efrain', 'Aaron', 'Deacon', 'Ansley', 'Armando', 'Antonia', 'Sophie', 'Genesis', 'Thea', 'Alice', 'Rylan', 'Frederick', 'Chris', 'Renata', 'Camilo', 'Tiana', 'Jeremy', 'Dylan', 'Wren', 'Willie', 'Irene', 'Courtney', 'Damon', 'Jermaine', 'Bryanna', 'Alyson', 'Louisa', 'Aileen', 'Morgan', 'Viviana', 'Theo', 'Alina', 'Conner', 'Sabrina', 'Giovanni', 'Kenny', 'Ernesto', 'Hugo', 'Asia', 'Tamia', 'Mohammad', 'Dixie', 'Conrad', 'Kailey', 'Chad', 'Eleanor', 'Willa', 'Jacob', 'Dwayne', 'David', 'Jessica', 'Elsie', 'Yosef', 'Brock', 'Moises', 'Lorenzo', 'Remy', 'Miranda', 'Seth', 'Briana', 'Ellen', 'Micah', 'Kenneth', 'Leah', 'Malcolm', 'Malachi', 'Vicente', 'Alexandra', 'Jedidiah', 'Ryker', 'Lia', 'Grant', 'Grace', 'Brooks', 'Angel', 'Justice', 'Reagan', 'Kara', 'Allison', 'Emmaline', 'Tony', 'Ricardo', 'Deshawn', 'Spencer', 'Santiago', 'Aliza', 'Alexia', 'Timothy', 'Laura', 'Marcos', 'Eric', 'Quentin', 'Edwin', 'Kameron', 'Arlo', 'Nadia', 'Ana', 'Charlotte', 'Dominic', 'Frankie', 'Zoey', 'Bridger', 'Daniella', 'Tate', 'Miguel', 'Micheal', 'Montserrat', 'Davis', 'Russell', 'Darren', 'Lizbeth', 'Kelvin', 'Brett', 'Shiloh', 'Dylan', 'Teresa', 'Jordyn', 'Frank', 'Justus', 'Alessandro', 'Dexter', 'Addison', 'Jayce', 'Ruben', 'Gabriella', 'Rylee', 'Autumn', 'Van', 'Sullivan', 'Brenda', 'Andrea', 'Aydin', 'Emelia', 'Francisco', 'Noelle', 'Camila', 'Marlon', 'Aleah', 'Marshall', 'Douglas', 'Muhammad', 'Ellie', 'Holly', 'Alec', 'Leslie', 'Kimberly', 'Aniyah', 'Urijah', 'Aubrie', 'Nora', 'Royce', 'Demetrius', 'Conor', 'Derek', 'Jerry', 'Trenton', 'Nikolai', 'Macey', 'Fiona', 'Malia', 'Zander', 'Ryleigh', 'Alyssa', 'Kaylie', 'Ivan', 'Leandro', 'Bruce', 'Marcelo', 'Emmanuel', 'Eden', 'Kole', 'Adrian', 'Clark', 'Kassandra', 'George', 'Rory', 'Andre', 'Natalie', 'Mitchell', 'Elin', 'Azariah', 'Joselyn', 'Jada', 'Leonidas', 'Daisy', 'Lennox', 'Makenna', 'Naomi', 'Alena', 'Emerson', 'Sandra', 'Marquis', 'Charley', 'Elsa', 'Sage', 'Zainab', 'Quinn', 'Landen', 'Khloe', 'Jose', 'Cullen', 'Fernanda', 'Tyson', 'Azariah', 'Orlando', 'Zuri', 'Maxwell', 'Phoenix', 'Blaine', 'Kinsley', 'Marcel', 'Shayla', 'Macie', 'Wendy', 'Isabella', 'Stephen', 'Ayla', 'Chance', 'Manuel', 'April', 'Hadley', 'Vivian', 'Elliott', 'Jessie', 'Hattie', 'Eddie', 'Siena', 'Bonnie', 'Gwen', 'Kaleigh', 'Hector', 'Kori', 'Juliet', 'Brian', 'Bristol', 'Mack', 'Paloma', 'Elliot', 'Reginald', 'Emiliano', 'Chaim', 'Allie', 'Jemma', 'Delaney', 'Thaddeus', 'Aydan', 'Alfonso', 'Teagan', 'Brittany', 'Grayson', 'Owen', 'Felix', 'Quinton', 'Ezekiel', 'Leonardo', 'Mariah', 'Annabelle', 'Raelyn', 'Moriah', 'John', 'Kallie', 'Magnolia', 'Kali', 'Vera', 'Dayton', 'Sawyer', 'Demi', 'Gunnar', 'Samantha', 'Winter', 'Lilia', 'Ivy', 'Nolan', 'Cara', 'Maverick', 'Howard', 'Deangelo', 'Adrienne', 'Atticus', 'Elizabeth', 'Joanna', 'Eugene', 'Yusuf', 'Mary', 'Evelyn', 'Jewel', 'Trent', 'Dominik', 'Aden', 'Kaitlynn', 'Maddox', 'Ally', 'Kristian', 'Lilian', 'Avery', 'Charlie', 'Alisha', 'King', 'Carlos', 'Kendall', 'Aspen', 'Preston', 'Gage', 'Aliya', 'Madeleine', 'Dante', 'Tomas', 'Julian', 'Ellis', 'Piper', 'Lillian', 'Vance', 'Jenny', 'Temperance', 'Nelson', 'Otto', 'Seamus', 'Jefferson', 'Emilio', 'Camron', 'Kaylin', 'Matthew', 'Byron', 'Callie', 'Giuliana', 'Aya', 'Jayda', 'Evalyn', 'Cordelia', 'Leila', 'Heather', 'Keegan', 'Cristian', 'Khalil', 'Devin', 'Maia', 'Lincoln', 'Sharon', 'Rebecca', 'Ibrahim', 'Cindy', 'Amara', 'Julie', 'Leighton', 'Arya', 'Darwin', 'Reyna', 'Harley', 'Angelica', 'Anabel', 'Logan', 'Eloise', 'Isaias', 'Liliana', 'Roberto', 'Braelyn', 'Madeline', 'Marjorie', 'Edith', 'Leia', 'Reuben', 'Ari', 'Madyson', 'Summer', 'Derrick', 'Jayden', 'Amber', 'Wade', 'Cain', 'Lillie', 'Carolina', 'Roy', 'Crystal', 'Faye', 'Harley', 'Jolie', 'Angelina', 'Valentin', 'Hana', 'Zaid', 'Romeo', 'Nickolas', 'Briella', 'Bryce', 'Carlie', 'Natalee', 'Rohan', 'Jack', 'Marc', 'Ariel', 'Regina', 'Giancarlo', 'Harry', 'Liam', 'Rosalie', 'Mariana', 'Jasper', 'Joslyn', 'Yasmin', 'Rebekah', 'Juliette', 'Rodolfo', 'Roland', 'Deborah', 'Anton', 'Carl', 'Adrien', 'Easton', 'Payton', 'Zayn', 'Harold', 'Maggie', 'William', 'Ingrid', 'Erik', 'Tobias'];

export default function initializeActivityGenerator(store) {
	getState = store.getState;
	dispatch = store.dispatch;
}

export class Activist {
	
	constructor(id) {
		this.id = id;
		this.started = false;
		this.counter = 0; // Counts the number of actions taken
		this.probabilities = [ // Reflects the chances to perform a given action
			{
				a: 'createMessage',
				p: 0.53,
			},
			{
				a: 'createVote',
				p: 0.3,
			},
			{
				a: 'createTopic',
				p: 0.09,
			},
			{
				a: 'createUser',
				p: 0.05,
			},
			{
				a: 'createUniverse',
				p: 0.03,
			},
		];
	}
	
	
	// Starts the show at a given pace
	start(pace) {
		this._initialize().then(
			() => {
				this.started = true;
				const loopActivities = () => this._generateActivity().then(
					data => {
						if (this.started) setTimeout(loopActivities, pace);
					},
					error => log('error', error)
				);
				
				loopActivities();
			},
			error => log('!!! activityGenerator', error)
		);
		
	}
	
	
	// Stops the activity
	stop() {
		this.started = false;
	}
	
	
	_initialize() {
		
		return new Promise((resolve, reject) => {
			const {id, probabilities} = this;
			let sum = 0;
			let lastValue = 0;
			
			// actionProbabilities construction
			probabilities.forEach(prob => {
				const { p } = prob;
				sum += p;
				prob.p = [lastValue, lastValue + p];
				lastValue += p;
			});
			
			if (sum !== 1) return reject(`Sum of probabilities !== 1 (sum === ${sum}`);
			
			queryDb('login', {email: id}).then(
				result => {
					if (result) return resolve();
					
					const email = id + '@activist.com';
					const password = 'password';
				},
				error => reject(error)
			);
		});
	}
	
	// The main loop
	_generateActivity() {
		this.counter++;
		const {id, counter} = this;
		
		const x = Math.random();
		const action = this.probabilities.find(({ p }) => x >= p[0] && x < p[1]).a;
		log(`generateActivity [${id} ${counter}] ${action}`);
		
		return this['_' + action]();
	}
	
	// _fetchRandomRow('universe').then(
	// 	data => resolve(data),
	// 	error => reject(error)
	// );
	_fetchRandomRow(table) {
		const query = {
			source: 'randomRow',
			params: table
		};
		return new Promise((resolve, reject) => {
			queryDb(query).then(
				data => resolve(data),
				error => reject(error)
			);
		});
	}
	
	_createUser() {
		
		return new Promise((resolve, reject) => {
			const action = actionCreators.createUser;
			
			resolve();
		});
	}
	
	_createMessage() {
		
		return new Promise((resolve, reject) => {
			const action = actionCreators.createMessage;
			
			resolve();
		});
	}
	
	_createUniverse() {
		
		return new Promise((resolve, reject) => {
			const action = actionCreators.createUniverse;
			
			resolve();
		});
	}
	
	_createTopic() {
		
		return new Promise((resolve, reject) => {
			const action = actionCreators.createTopic;
			
			resolve();
		});
	}
	
	_createVote() {
		
		return new Promise((resolve, reject) => {
			const isTopic = Math.random() > 0.5;
			const action = isTopic ? actionCreators.createVoteTopic : actionCreators.createVoteMessage;
			
			resolve();
		});
	}
	
}

// Creates a bunch of activists
export function createActivists(n, minPace, maxPace) {
	
	let activists = [];
	let paces = [];
	const namesListLength = names.length;
	
	for (let i = 0; i < n; i++) {
		let id;
		do {
			const selectedName = names[randomInteger(0, namesListLength)];
			const existant = activeNames.find(name => name === selectedName);
			
			if (!existant) {
				id = selectedName;
				activeNames.push(selectedName);
			}
		} while(!id);
		
		activists.push(new Activist(id));
		paces.push(randomInteger(minPace, maxPace));
	}
	
	function startActivists() {
		for (let i = 0; i < n; i++) {
			activists[i].start(paces[i]);
		}
	}
	
	function stopActivists() {
		for (let i = 0; i < n; i++) {
			activists[i].stop();
		}
	}
	
	return {startActivists, stopActivists};
}
