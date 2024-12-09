import { useState, useTransition, useActionState, useOptimistic } from "react";

export function UseState() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      await updateName(name);
      redirect("/success");
    } catch (error) {
      setError(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export function UseTransition() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition(false);

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        await updateName(name);
        redirect("/success");
      } catch (error) {
        setError(error);
      }
    });
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export function UseActionState() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      try {
        await updateName(formData.get("name"));
        redirect("/path");
        return null;
      } catch (err) {
        return err;
      }
    },
    null
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export function UseOptimistic({}) {
  const currentName = "arcz";
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async (formData) => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    try {
      await updateName(newName);
    } catch {}
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}

function redirect(path) {
  // window.location.href = path;
}

async function updateName(name) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (name === "error") {
        rej("Error: Name cannot be 'error'");
      } else {
        res(null);
      }
    }, 1000);
  });
}
