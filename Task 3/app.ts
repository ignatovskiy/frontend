import express from "express";
import { createReadStream, existsSync } from "fs";


interface User {
	id: number;
	username: string;
	games: GameSecondsPlayed[];
}

interface Game {
	id: number;
	title: string;
	description: string;
	images: string[];
	ageRating: string;
}

interface GameSecondsPlayed {
	game: Game;
	gameSecondsPlayed: number;
}

interface DB {
	users: User[];
	games: Game[];
}

const DB: DB = {
	games: [
				{
					id: 0,
					title: "Mirror's Edge",
					description: "In a city where information is heavily monitored, couriers called Runners transport sensitive data. In this seemingly utopian paradise, a crime has been committed, & you are being hunted. You are a Runner called Faith and this innovative first-person action-adventure is your story.",
					ageRating: "T",
					images: ['image_0', 'image_1'],
				},
				{
					id: 1,
					title: "Deus Ex: Game of the Year Edition",
					description: "The year is 2052 and the world is a dangerous and chaotic place. Terrorists operate openly - killing thousands; drugs, disease and pollution kill even more. The world's economies are close to collapse and the gap between the insanely wealthy and the desperately poor grows ever wider.",
					ageRating: "M",
					images: ['image_0', 'image_1', 'image_3'],
				},
				{
					id: 2,
					title: "Titanfall 2",
					description: "Respawn Entertainment gives you the most advanced titan technology in its new, single player campaign & multiplayer experience. Combine & conquer with new titans & pilots, deadlier weapons, & customization and progression systems that help you and your titan flow as one unstoppable killing force.",
					ageRating: "M",
					images: ['image_0'],
				},
				{
					id: 3,
					title: "FINAL FANTASY XIV Online",
					description: "ake part in an epic and ever-changing FINAL FANTASY as you adventure and explore with friends from around the world.",
					ageRating: "T",
					images: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
				},
			],

	users: [
				{
					id: 0,
					username: 'xXx_sephiroth1997_xXx',
					games: [
								{
									game: {
										id: 3,	
										title: "FINAL FANTASY XIV Online",
										description: "ake part in an epic and ever-changing FINAL FANTASY as you adventure and explore with friends from around the world.",
										ageRating: "T",
										images: ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'],
									},
									gameSecondsPlayed: 1440000
								},
								{
									game: {
										id: 0,
										title: "Mirror's Edge",
										description: "In a city where information is heavily monitored, couriers called Runners transport sensitive data. In this seemingly utopian paradise, a crime has been committed, & you are being hunted. You are a Runner called Faith and this innovative first-person action-adventure is your story.",
										ageRating: "T",
										images: ['image_0', 'image_1'],
									},
									gameSecondsPlayed: 72000,
								},
								{
									game: {
										id: 2,
										title: "Titanfall 2",
										description: "Respawn Entertainment gives you the most advanced titan technology in its new, single player campaign & multiplayer experience. Combine & conquer with new titans & pilots, deadlier weapons, & customization and progression systems that help you and your titan flow as one unstoppable killing force.",
										ageRating: "M",
										images: ['image_0'],
									},
									gameSecondsPlayed: 36000,
								},
							]
				},
				{
					id: 1,
					username: 'Gregor',
					games: [
								{
									game: {
										id: 2,
										title: "Titanfall 2",
										description: "Respawn Entertainment gives you the most advanced titan technology in its new, single player campaign & multiplayer experience. Combine & conquer with new titans & pilots, deadlier weapons, & customization and progression systems that help you and your titan flow as one unstoppable killing force.",
										ageRating: "M",
										images: ['image_0'],
									},
									gameSecondsPlayed: 630000,
								},
								{
									game: {
										id: 1,
										title: "Deus Ex: Game of the Year Edition",
										description: "The year is 2052 and the world is a dangerous and chaotic place. Terrorists operate openly - killing thousands; drugs, disease and pollution kill even more. The world's economies are close to collapse and the gap between the insanely wealthy and the desperately poor grows ever wider.",
										ageRating: "M",
										images: ['image_0', 'image_1', 'image_3'],
									},
									gameSecondsPlayed: 828000,
								},
							]
				},
			]
}


const app = express();


//GET games/[id]
app.get("/games/:id", function(request, response) {
	const id = parseInt(request.params.id);
	const game = DB.games.find((game) => game.id == id);

	if (game) {
		response.json(game);
	}
	else {
		response.status(404);
		response.send();
	}
});


//GET games
app.get("/games", function(request, response) {
	response.json(DB.games);
});


//POST games
let currentGameID: number = DB.games.length;
app.post("/games", function(request, response) {
	let game = request.body;

	game.id = currentGameID;
	currentGameID += 1;
	DB.games = [...DB.games, game];

	response.json({ id: game.id });
});


//PUT games/[id]
app.put("/games/:id", function(request, response) {
	const id = parseInt(request.params.id);
	const game = DB.games.findIndex((game) => game.id == id);

	DB.games[game] = request.body;

	response.send();
});


//DELETE games/[id]
app.delete("/games/:id", function(request, response) {
	const id = parseInt(request.params.id);

	DB.games = DB.games.filter((game) => game.id != id);
	DB.users.forEach(user => {
		user.games = user.games.filter((gameRecord) => gameRecord.game.id != id)
	});

	response.send();
});


//GET users/[id]
app.get("/users/:id", function(request, response) {
	const id = parseInt(request.params.id);
	const user = DB.users.find((user) => user.id == id);

	if (user) {
		response.json({id: id, name: user.username});
	}
	else {
		response.status(404);
		response.send();
	}
});


//POST users
let currentUserID: number = DB.users.length;
app.post("/users", function(request, response) {
	const user = request.body;

	user.id = currentUserID;
	currentUserID += 1;
	DB.users = [...DB.users, user];

	response.json({ id: user.id })
});


//PUT users/[id]
app.put("/users/:id", function(request, response) {
	const id = parseInt(request.params.id);
	const user = request.body;
	user.id = id;
	const userid = DB.users.findIndex((user) => user.id == id);

	DB.users[userid] = user;

	response.send();
});


//DELETE users/[id]
app.delete("/users/:id", function(request, response) {
	const id = parseInt(request.params.id);
	DB.users = DB.users.filter((user) => user.id != id);

	response.send();
});


//GET users/[id]/games
app.get("/users/:id/games", function(request, response) {
	const id = parseInt(request.params.id);
	let user = DB.users.find((user) => user.id == id);

	if (user) {
		response.json(user.games);
	}
	else {
		response.status(404);
	 	response.send();
	}
});


//POST users/[id]/games
app.post("/users/:id/games", function(request, response) {
	const id = parseInt(request.params.id);
	const game = request.body;
	game.gameSecondsPlayed = 0;
	const userid = DB.users.findIndex((user) => user.id == id);

	if (userid != -1) {
		let user = DB.users[userid];
		DB.users[userid].games = [...user.games, game];
		response.send();
	}
	else {
		response.status(404);
		response.send();
	}
});


//POST users/[id]/games/[gameid]
app.post("/users/:id/games/:gameid", function(request, response) {
	const id = parseInt(request.params.id);
	const gameid = parseInt(request.params.gameid);
	const gameSecondsPlayed = request.body as GameSecondsPlayed;
	const userid = DB.users.findIndex((user) => user.id == id);

	if (userid != -1) {
		const user = DB.users[userid]
		const gameIndex = user.games.findIndex((game) => game.game.id == gameid);

		if (gameIndex != -1) {
			const game = user.games[gameIndex];

			game.gameSecondsPlayed += gameSecondsPlayed.gameSecondsPlayed;
			user.games[gameIndex] = game;
		} 
		else {
			user.games = [...user.games, gameSecondsPlayed];
		}

		DB.users[userid] = user;

		response.send();
	}
	else {
		response.status(404);
		response.send();
	}
});


//DELETE users/[id]/games/[gameid]
app.delete("/users/:id/games/:gameid", function(request, response) {
	const id = parseInt(request.params.id);
	const gameid = parseInt(request.params.gameid);
	const userid = DB.users.findIndex((user) => user.id == id);

	if (userid != -1) {
		DB.users[userid].games.filter((game) => game.game.id != gameid);
		response.send();
	}
	else {
		response.status(404);
	 	response.send();
	}
});


//GET static/text/[a file]
app.get("/static/text/:file", function(request, response) {
	const file = request.params.file;

	if (existsSync(file)) {
		createReadStream(file).pipe(response);
	} 
	else {
		response.status(404);
	 	response.send();
	}
});


app.listen(5555, () => {
	console.log("Started server at port 5555");
})