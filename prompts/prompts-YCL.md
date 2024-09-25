# ATS Front end 

# Prompt 1  - V0 pedir maquetacion

Primero decidí con ayuda de V0 obtener todo el componente de position maquetado.

Se utiliza el siguiente propmt:

```
Your task in this exercise is to create the "position" interface using React. This will be a page for viewing and managing candidates for a specific job position.

The interface will follow a kanban-style layout, displaying candidates as cards in different columns, each representing a stage in the hiring process. The user should be able to update the stage of a candidate simply by dragging and dropping their card. An example mockup of the interface is provided in the attached file.

Additionally, consider the following design team requirements visible in the example:

*The job position title should be displayed at the top of the page to provide context. *Include a back arrow to the left of the title that allows returning to the list of job positions. 
*Display as many columns as there are stages in the hiring process. 
*Each candidate card should be placed in the appropriate column based on their stage and must display the candidate's full name and average score. 
*The interface must be fully responsive.
```

## Answer 1 - AI V0 

https://v0.dev/chat/jkiD92MDWKr?b=b_2PwbPGmIwvs&p=0

# Prompt 2  - Cursor para integrar la maquetacion

Incorporate functionality so that when the user clicks the "Ver proveso" button in the @Positions.tsx  , they are redirected and integrated into the Position component located in the @position.tsx  file.

## Answer 2

To achieve the desired functionality, we need to:

1. Add routing to navigate from the `Positions` component to the `Position` component.
2. Pass the necessary data (e.g., position title) to the `Position` component when navigating.

Here's how you can do it:

### Step 1: Update the `App.js` to include the new route

Update the `App.js` file to include a route for the `Position` component. This will allow us to navigate to the `Position` component when the "Ver proceso" button is clicked.

```javascript:frontend/src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm'; 
import Positions from './components/Positions'; 
import Position from './components/position'; // Import the Position component

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/position/:title" element={<Position />} /> {/* Add this line */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

### Step 2: Update the `Positions` component to handle navigation

Update the `Positions` component to navigate to the `Position` component when the "Ver proceso" button is clicked. We will use the `useNavigate` hook from `react-router-dom` to handle the navigation.

```typescript:frontend/src/components/Positions.tsx
import React from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type Position = {
    title: string;
    manager: string;
    deadline: string;
    status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};

const mockPositions: Position[] = [
    { title: 'Senior Backend Engineer', manager: 'John Doe', deadline: '2024-12-31', status: 'Abierto' },
    { title: 'Junior Android Engineer', manager: 'Jane Smith', deadline: '2024-11-15', status: 'Contratado' },
    { title: 'Product Manager', manager: 'Alex Jones', deadline: '2024-07-31', status: 'Borrador' }
];

const Positions: React.FC = () => {
    const navigate = useNavigate();

    const handleViewProcess = (title: string) => {
        navigate(`/position/${title}`);
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" />
                </Col>
                <Col md={3}>
                    <Form.Control type="date" placeholder="Buscar por fecha" />
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Estado</option>
                        <option value="open">Abierto</option>
                        <option value="filled">Contratado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Manager</option>
                        <option value="john_doe">John Doe</option>
                        <option value="jane_smith">Jane Smith</option>
                        <option value="alex_jones">Alex Jones</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row>
                {mockPositions.map((position, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{position.title}</Card.Title>
                                <Card.Text>
                                    <strong>Manager:</strong> {position.manager}<br />
                                    <strong>Deadline:</strong> {position.deadline}
                                </Card.Text>
                                <span className={`badge ${position.status === 'Abierto' ? 'bg-warning' : position.status === 'Contratado' ? 'bg-success' : position.status === 'Borrador' ? 'bg-secondary' : 'bg-warning'} text-white`}>
                                    {position.status}
                                </span>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button variant="primary" onClick={() => handleViewProcess(position.title)}>Ver proceso</Button>
                                    <Button variant="secondary">Editar</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Positions;
```

### Step 3: Update the `Position` component to receive the title as a parameter

Update the `Position` component to receive the title as a parameter from the URL and display it.

```typescript:frontend/src/components/position.tsx
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";

// Define types for our data structures
type Candidate = {
  id: string;
  name: string;
  score: number;
};

type Column = {
  id: string;
  title: string;
  candidates: Candidate[];
};

type Board = {
  columns: Column[];
};

// Sample data
const initialBoard: Board = {
  columns: [
    {
      id: "phone",
      title: "Llamada telefónica",
      candidates: [
        { id: "1", name: "John Doe", score: 3 },
        { id: "2", name: "Alice Johnson", score: 4 },
      ],
    },
    {
      id: "technical",
      title: "Entrevista técnica",
      candidates: [{ id: "3", name: "Jane Smith", score: 3 }],
    },
    {
      id: "cultural",
      title: "Entrevista cultural",
      candidates: [{ id: "4", name: "Bob Brown", score: 2 }],
    },
    {
      id: "manager",
      title: "Entrevista manager",
      candidates: [{ id: "5", name: "Eva White", score: 5 }],
    },
  ],
};

export default function Position() {
  const { title } = useParams<{ title: string }>();
  const [board, setBoard] = useState<Board>(initialBoard);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board.columns.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = board.columns.find(
        (col) => col.id === destination.droppableId
      );
      const sourceCandidates = [...sourceColumn!.candidates];
      const destCandidates = [...destColumn!.candidates];
      const [removed] = sourceCandidates.splice(source.index, 1);
      destCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: sourceCandidates };
          }
          if (col.id === destination.droppableId) {
            return { ...col, candidates: destCandidates };
          }
          return col;
        }),
      });
    } else {
      const column = board.columns.find((col) => col.id === source.droppableId);
      const copiedCandidates = [...column!.candidates];
      const [removed] = copiedCandidates.splice(source.index, 1);
      copiedCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: copiedCandidates };
          }
          return col;
        }),
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex items-center">
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{title} Position</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {board.columns.map((column) => (
            <div key={column.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {column.candidates.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 p-3 rounded border border-gray-200"
                          >
                            <div className="font-medium">{candidate.name}</div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full mr-1 ${
                                    i < candidate.score
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
```

With these changes, clicking the "Ver proceso" button in the `Positions` component will navigate to the `Position` component, displaying the title of the selected position.

# Prompt 3  - Instalar css tailwind

how can I install tailwind in this proyect?

## Answer 3

To install Tailwind CSS in your project, follow these steps:

### Step 1: Install Tailwind CSS

First, you need to install Tailwind CSS and its dependencies. Run the following command in your project directory:

```sh
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Initialize Tailwind CSS

Next, initialize Tailwind CSS by creating the configuration files. Run the following command:

```sh
npx tailwindcss init -p
```

This will create two new files in your project:

- `tailwind.config.js`
- `postcss.config.js`

### Step 3: Configure Tailwind CSS

Update the `tailwind.config.js` file to specify the paths to all of your template files. This will ensure that Tailwind CSS can purge unused styles in production.

```javascript:tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 4: Add Tailwind CSS to your CSS

Create a new CSS file (e.g., `src/tailwind.css`) and add the following lines to include Tailwind's base, components, and utilities styles:

```css:src/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Import Tailwind CSS in your project

Import the newly created `src/tailwind.css` file in your `src/index.tsx` file:


```3:3:frontend/src/index.tsx
import './index.css';
```


Add the following line:

```typescript:frontend/src/index.tsx
import './tailwind.css';
```

### Step 6: Update your build scripts

Ensure your build scripts are set up to process Tailwind CSS. This is typically handled by Create React App's default configuration, but you can customize it if needed.

### Step 7: Use Tailwind CSS in your components

You can now use Tailwind CSS classes in your React components. For example, update the `App.tsx` file to use Tailwind classes:

```typescript:frontend/src/App.tsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

Change the above code to use Tailwind CSS classes:

```typescript:frontend/src/App.tsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="text-center">
      <header className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
        <img src={logo} className="h-40 pointer-events-none" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="text-blue-400"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

### Step 8: Start your development server

Finally, start your development server to see Tailwind CSS in action:

```sh
npm start
```

With these steps, Tailwind CSS should be successfully integrated into your project. You can now use Tailwind's utility classes to style your components.


# Prompt 4  - Integrar las API de obtener datos

crea un servicio en @candidateService.js para obtener la siguiente api:
```
GET /positions/:id/interviewFlow
Este endpoint devuelve información sobre el proceso de contratación para una determinada posición:

positionName: Título de la posición
interviewSteps: id y nombre de las diferentes fases de las que consta el proceso de contratación
{
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
```

## Answer 4

To create a service in `candidateService.js` for the `GET /positions/:id/interviewFlow` API, you can add a new function to fetch the interview flow data. Here's how you can do it:

```javascript:frontend/src/services/candidateService.js
import axios from 'axios';

export const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('http://localhost:3010/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Devuelve la ruta del archivo y el tipo
    } catch (error) {
        throw new Error('Error al subir el archivo:', error.response.data);
    }
};

export const sendCandidateData = async (candidateData) => {
    try {
        const response = await axios.post('http://localhost:3010/candidates', candidateData);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar datos del candidato:', error.response.data);
    }
};

// New function to get interview flow by position ID
export const getInterviewFlowByPosition = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/positions/${positionId}/interviewFlow`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el flujo de entrevistas:', error.response.data);
    }
};
```

This new function, `getInterviewFlowByPosition`, makes a GET request to the specified endpoint and returns the interview flow data for a given position ID. If there's an error, it throws an error with a message.

# Prompt 5  - Integrar los datos en el componente

The new created service: getInterviewFlowByPosition is going to return the data in the next format:

```
{
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
```
Change the position component in @Position.tsx  to get the data from the service getInterviewFlowByPosition instead of the current sample data, this is to create the "columns" in the Board. The next is the match case of the key columns:

* id key in object Board Column:  is the "id" of the column return by the service.
* title key in object Board Column: is the "name" of the column return by the service
* leave the candidates as empty array by default


## Answer 5 

To update the `Position` component to fetch data from the `getInterviewFlowByPosition` service and create the columns dynamically, follow these steps:

1. Import the `getInterviewFlowByPosition` service.
2. Fetch the data when the component mounts.
3. Update the state with the fetched data to create the columns dynamically.

Here's the updated `Position` component:

```typescript:frontend/src/components/Position.tsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { getInterviewFlowByPosition } from "../services/candidateService";

// Define types for our data structures
type Candidate = {
  id: string;
  name: string;
  score: number;
};

type Column = {
  id: string;
  title: string;
  candidates: Candidate[];
};

type Board = {
  columns: Column[];
};

export default function Position() {
  const { title } = useParams<{ title: string }>();
  const [board, setBoard] = useState<Board>({ columns: [] });

  useEffect(() => {
    const fetchInterviewFlow = async () => {
      try {
        const data = await getInterviewFlowByPosition(title);
        const columns = data.interviewFlow.interviewSteps.map((step: any) => ({
          id: step.id,
          title: step.name,
          candidates: [],
        }));
        setBoard({ columns });
      } catch (error) {
        console.error("Error fetching interview flow:", error);
      }
    };

    fetchInterviewFlow();
  }, [title]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board.columns.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = board.columns.find(
        (col) => col.id === destination.droppableId
      );
      const sourceCandidates = [...sourceColumn!.candidates];
      const destCandidates = [...destColumn!.candidates];
      const [removed] = sourceCandidates.splice(source.index, 1);
      destCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: sourceCandidates };
          }
          if (col.id === destination.droppableId) {
            return { ...col, candidates: destCandidates };
          }
          return col;
        }),
      });
    } else {
      const column = board.columns.find((col) => col.id === source.droppableId);
      const copiedCandidates = [...column!.candidates];
      const [removed] = copiedCandidates.splice(source.index, 1);
      copiedCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: copiedCandidates };
          }
          return col;
        }),
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex items-center">
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{title} Position</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {board.columns.map((column) => (
            <div key={column.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {column.candidates.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 p-3 rounded border border-gray-200"
                          >
                            <div className="font-medium">{candidate.name}</div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full mr-1 ${
                                    i < candidate.score
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
```

In this updated component:

1. The `getInterviewFlowByPosition` service is imported.
2. The `useEffect` hook is used to fetch the interview flow data when the component mounts.
3. The state is updated with the fetched data to create the columns dynamically.
4. The `Droppable` component's `droppableId` is converted to a string to match the `id` type.

# Prompt 6 - Integrate candidate service

crea un servicio en @candidateService.js para obtener la siguiente api:
```
GET /position/:id/candidates
Este endpoint devuelve todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Proporciona la siguiente información:

name: Nombre completo del candidato
current_interview_step: en qué fase del proceso está el candidato.
score: La puntuación media del candidato
[
      {
           "fullName": "Jane Smith",
           "currentInterviewStep": "Technical Interview",
           "averageScore": 4
       },
       {
           "fullName": "Carlos García",
           "currentInterviewStep": "Initial Screening",
           "averageScore": 0            
       },        
       {
           "fullName": "John Doe",
           "currentInterviewStep": "Manager Interview",
           "averageScore": 5            
      }    
 ]
```

# Prompt 6 - Integrate candidate service

The new created service: getCandidatesByPosition is going to return the data in the next format sample:

```
[
    {
        "fullName": "Jane Smith",
        "currentInterviewStep": "Technical Assessment",
        "averageScore": 0
    },
    {
        "fullName": "John Doe",
        "currentInterviewStep": "Technical Assessment",
        "averageScore": 0
    }
]
```

Change the position component in @Position.tsx  to get the data fo the candidate from the service getCandidatesByPosition instead of empty array, this is to add the draggable candidates in the the Board. The next is the match case of the key columns:

* id key in object Board Column:  is the "id" of the column return by the service.
* name key in object Board Column: is the "name" of the column return by the service
* score key in object Board Column: is the "score" of the column return by the service

# Prompt 7 - Add the title of the page with the service

For the service 'getInterviewFlowByPosition' the response data key interviewFlow.positionName is the h1 title of the @Position.tsx , please update it

# answer 7 - Add the title of the page with the service

To update the `Position` component to use the `positionName` from the `getInterviewFlowByPosition` service response as the title, you need to:

1. Update the state to store the `positionName`.
2. Set the `positionName` when fetching the interview flow data.
3. Use the `positionName` in the `h1` element.

Here's the updated `Position` component:

```typescript:frontend/src/components/Position.tsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { getInterviewFlowByPosition, getCandidatesByPosition } from "../services/candidateService";

// Define types for our data structures
type Candidate = {
  id: string;
  name: string;
  score: number;
};

type Column = {
  id: string;
  title: string;
  candidates: Candidate[];
};

type Board = {
  columns: Column[];
};

export default function Position() {
  const { title } = useParams<{ title: string }>();
  const [board, setBoard] = useState<Board>({ columns: [] });
  const [positionName, setPositionName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interviewFlowData = await getInterviewFlowByPosition(title);
        setPositionName(interviewFlowData.positionName);
        const columns = interviewFlowData.interviewFlow.interviewSteps.map(
          (step: any) => ({
            id: step.id,
            title: step.name,
            candidates: [],
          })
        );

        const candidatesData = await getCandidatesByPosition(title);
        candidatesData.forEach((candidate: any) => {
          const column = columns.find(
            (col: any) => col.title === candidate.currentInterviewStep
          );
          if (column) {
            column.candidates.push({
              id: candidate.id,
              name: candidate.fullName,
              score: candidate.averageScore,
            });
          }
        });

        setBoard({ columns });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [title]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board.columns.find(
        (col) => col.id.toString() === source.droppableId
      );
      const destColumn = board.columns.find(
        (col) => col.id.toString() === destination.droppableId
      );
      const sourceCandidates = [...sourceColumn!.candidates];
      const destCandidates = [...destColumn!.candidates];
      const [removed] = sourceCandidates.splice(source.index, 1);
      destCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id.toString() === source.droppableId) {
            return { ...col, candidates: sourceCandidates };
          }
          if (col.id.toString() === destination.droppableId) {
            return { ...col, candidates: destCandidates };
          }
          return col;
        }),
      });
    } else {
      const column = board.columns.find((col) => col.id === source.droppableId);
      const copiedCandidates = [...column!.candidates];
      const [removed] = copiedCandidates.splice(source.index, 1);
      copiedCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: copiedCandidates };
          }
          return col;
        }),
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex items-center">
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{positionName} Position</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {board.columns.map((column) => (
            <div key={column.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-4">{column.title}</h2>
              <Droppable
                droppableId={column.id.toString()}
                key={column.id.toString()}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {column.candidates.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 p-3 rounded border border-gray-200"
                          >
                            <div className="font-medium">{candidate.name}</div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full mr-1 ${
                                    i < candidate.score
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
```

In this updated component:

1. A new state variable `positionName` is added to store the position name.
2. The `positionName` is set when fetching the interview flow data.
3. The `positionName` is used in the `h1` element to display the title.

