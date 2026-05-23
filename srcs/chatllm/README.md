# ChatLLM API Documentation

Base URL

```txt
/vllm/v1
```

---

# POST /load-document

Charge une page web, extrait le contenu HTML et ajoute les documents au vector store.

## Request Body

```json
{
  "name": "documentation",
  "url": "https://example.com"
}
```

## Success Response

### 201 Created

```json
{
  "message": "success"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Bad request"
}
```

### 404 Not Found

```json
{
  "message": "Loading page failed!"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# POST /newchat

Créer une nouvelle conversation.

## Request Body

```json
{
  "title": "new conversation"
}
```

## Success Response

### 201 Created

```json
{
  "id": 1
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Bad request."
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# POST /generate

Génère une réponse IA en streaming depuis une liste de messages.

## Request Body

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Bonjour"
    }
  ]
}
```

## Success Response

Content-Type:

```txt
application/stream+json
```

Exemple de stream :

```json
{
  "role": "assistant",
  "content": "Bonjour 👋"
}
```
```json
{
  "role": "tool",
  "content": "<Tool call return>"
}
```
## Error Responses

### 400 Bad Request

```json
{
  "message": "Bad request."
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# POST /chat/:id

Ajoute un message dans une conversation puis génère une réponse IA.

## URL Params

| Param | Type |
|---|---|
| id | integer |

## Request Body

```json
{
  "message": {
    "role": "user",
    "content": "Bonjour"
  }
}
```

## Success Response

Content-Type:

```txt
application/stream+json
```

Exemple de stream :

```json
{
  "role": "assistant",
  "content": "Bonjour 👋"
}
```
```json
{
  "role": "tool",
  "content": "<Tool call return>"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Bad request."
}
```

### 404 Not Found

```json
{
  "message": "Chat history not found."
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# GET /chat/:id

Récupère une conversation depuis son identifiant.

## URL Params

| Param | Type |
|---|---|
| id | integer |

## Success Response

### 200 OK

```json
{
  "chatBox": {
    "id": 1,
    "idUser": 0,
    "title": "new conversation",
    "createdAt": "2026-05-23T07:00:00.000Z",
    "updatedAt": "2026-05-23T07:00:00.000Z"
  }
}
```

## Error Responses

### 404 Not Found

```json
{
  "message": "Chat history not found."
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# GET /chat

Récupère toutes les conversations utilisateur.

## Success Response

### 200 OK

```json
[
  {
    "id": 1,
    "idUser": 0,
    "title": "new conversation",
    "createdAt": "2026-05-23T07:00:00.000Z",
    "updatedAt": "2026-05-23T07:00:00.000Z"
  }
]
```

## Error Responses

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# GET /history/:id

Récupère l'historique des messages d'une conversation.

## URL Params

| Param | Type |
|---|---|
| id | integer |

## Success Response

### 200 OK

```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Bonjour",
    "ChatBoxId": 1,
    "createdAt": "2026-05-23T07:00:00.000Z",
    "updatedAt": "2026-05-23T07:00:00.000Z"
  }
]
```

## Error Responses

### 404 Not Found

```json
{
  "message": "History not found."
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal Error"
}
```

---

# PUT /chat/:msgId

Modifier un message.

## URL Params

| Param | Type |
|---|---|
| msgId | integer |

## Success Response

### 200 OK

```json
{
  "message": "Updated!"
}
```