const express = require("express");
const cors = require("cors");
const { isUuid, uuid } = require("uuidv4")

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if( title && url && techs ) {

    const repository = { id: uuid(), url, title, techs, likes: 0 };
    repositories.push( repository );

    return response.status( 201 ).json(repository);
  } else 
    return response.status(400).send({ message: "All input is required!" })

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  var { title, url, techs } = request.body;

  
  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if(repositoryIndex < 0)
    return response.status(400).send({message: "Repository not found"});

  //if( !title && !url && !techs ) 
  const oldRespository = repositories[repositoryIndex];
  title = title || oldRespository.title
  url = url || oldRespository.url
  techs = techs || oldRespository.tech

  const repository = { ...repositories[repositoryIndex], 
    title, 
    url, 
    techs 
   }

  repositories[repositoryIndex] = repository
  
  return response.send(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex((repository) => repository.id === id)

  if(repositoryIndex < 0)
    return response.status(400).send({message: 'Invalid or does exist repository id'})

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send({ message: "deleted with success" })

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id)

  if(repositoryIndex < 0)
    return response.status(400).send({message: 'Invalid or does exist repository id'})

  const likes = repositories[repositoryIndex].likes += 1

  return response.send({ likes: likes })
});

module.exports = app;
