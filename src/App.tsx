import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

type TodoItem = {
    id: string;
    name: string;
    isComplete: boolean;
};

const getTodos = async () => {
    const api = 'http://localhost:4000/api/todos';

    const response = await fetch(api);

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const data = await response.json();

    return data as TodoItem[];
};

const createTodo = async (item: Partial<TodoItem>) => {
    const api = 'http://localhost:4000/api/todos';

    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const data = await response.json();

    return data as TodoItem;
};

const updateTodo = async (todoItem: Partial<TodoItem>) => {
    const api = `http://localhost:4000/api/todos/${todoItem.id}`;

    const { isComplete } = todoItem;

    const response = await fetch(api, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isComplete }),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const data = await response.json();

    return data as TodoItem;
};

function App() {
    const {
        data: todos,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
    });

    const { mutateAsync: createTodoAsync } = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            refetch();
        },
    });

    const { mutateAsync: updateTodoAsync } = useMutation({
        mutationFn: updateTodo,
        onSuccess: () => {
            refetch();
        },
    });
    return (
        <div className="flex flex-col h-screen gap-4 bg-gray-200">
            <Header />
            <main>
                <div className="mx-auto container max-w-sm">
                    <AddTodo createFn={createTodoAsync} />
                    <div className="mt-6 flex flex-col justify-center">
                        {isLoading && (
                            <p className="text-gray-700">Loading...</p>
                        )}

                        {todos &&
                            todos.map((item) => (
                                <TodoItem
                                    key={item.id}
                                    name={item.name}
                                    isCompleted={item.isComplete}
                                    onMarkComplete={async (
                                        isComplete: boolean
                                    ) =>
                                        updateTodoAsync({
                                            isComplete,
                                            id: item.id,
                                        })
                                    }
                                />
                            ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

function Header() {
    return (
        <header className="bg-blue-500 min-h-[200px] flex items-center justify-center">
            <h1 className="text-white text-2xl font-semibold">Todo App</h1>
        </header>
    );
}

type AddTodoProps = {
    createFn: (item: Partial<TodoItem>) => Promise<TodoItem>;
};

function AddTodo({ createFn }: AddTodoProps) {
    const [name, setName] = useState('');

    const onCreate = () => {
        createFn({
            name,
            isComplete: false,
        });

        setName('');
    };

    return (
        <div className="flex gap-2 justify-center">
            <input
                type="text"
                className="border border-gray-300 rounded-md py-1 px-4"
                placeholder="Add todo item"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                disabled={!name || name.length === 0}
                onClick={onCreate}
                className="bg-blue-500 hover:bg-blue-700 disabled:opacity-75 disabled:hover:bg-blue-500 px-4 py-1 rounded-md text-white"
            >
                Add
            </button>
        </div>
    );
}

type TodoItemProps = {
    name: string;
    isCompleted: boolean;
    onMarkComplete: (isComplete: boolean) => void;
};
function TodoItem({ name, isCompleted, onMarkComplete }: TodoItemProps) {
    return (
        <div className="flex gap-2">
            <input
                checked={isCompleted}
                type="checkbox"
                className="h-5 w-5"
                onChange={(e) => {
                    onMarkComplete(e.target.checked);
                }}
            />
            <p
                className={classNames(
                    isCompleted ? 'line-through text-gray-500' : 'text-gray-700'
                )}
            >
                {name}
            </p>
        </div>
    );
}

export default App;
