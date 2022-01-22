# auth-todo-client

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Docker commands

```
docker build -t cemalcanisci/app-todo-client .

docker run -it -p 8080:80 --rm --name app-todo-frontend cemalcanisci/app-todo-client
```

### Environment Variables

Your can change this environment variable in .env.development and .env.production files :

```
VUE_APP_TODO_SERVICE_URL=http://localhost:3000
```

### Firebase Link

[Auth Todo App](https://auth-todo-55ecb.web.app).
