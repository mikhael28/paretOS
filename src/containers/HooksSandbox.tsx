/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-else-return */
import { useState, useEffect, useRef, useCallback, MutableRefObject, ReactNode, LegacyRef } from "react";

export function DemoComponent() {
  const [value, toggleValue] = useToggle(false);
  const [count, setCount] = useState(10);
  const { clear: clearTimeout, reset } = useTimeout(() => setCount(0), 1000);

  const [debounceCount, setDebounceCount] = useState(10);
  useDebounce(() => alert(debounceCount), 1000, [debounceCount]);

  //   this calls an alert, each time after the initial render of the count
  useUpdateEffect(() => alert(count), [count]);

  const { array, set, push, remove, filter, update, clear } = useArray([
    1, 2, 3, 4, 5, 6,
  ]);

  const previousCount = usePrevious(null);

  const [name, setName, removeName] = useSessionStorage("name", "Kyle");
  const [age, setAge, removeAge] = useLocalStorage("age", 26);

  return (
    <div>
      <div>
        <h4>{array.join(", ")}</h4>
        <button onClick={() => push(7)}>Add 7</button>
        <button onClick={() => update(1, 9)}>Change Second Element to 9</button>

        <button onClick={() => remove(1)}>Remove Second Element</button>

        <button onClick={() => filter((n: number) => n < 3)}>
          Keep numbers less than 4
        </button>
        <button onClick={() => set([1, 2])}>Set to 1, 2</button>
        <button onClick={clear}>Clear</button>
      </div>
      <div>
        <h4>Toggle Value: {value.toString()}</h4>
        <button onClick={toggleValue}>Toggle</button>
        <button onClick={() => toggleValue(true)}>Make True</button>
        <button onClick={() => toggleValue(false)}>Make False</button>
      </div>

      <div>
        <h4>Timeout Count: {count}</h4>
        <button onClick={() => setCount((c) => c + 1)}>Increment</button>
        <button onClick={clearTimeout}>Clear Timeout</button>
        <button onClick={reset}>Reset Timeout</button>
      </div>
      <div>
        <h4>Debounce Count: {debounceCount}</h4>
        <button onClick={() => setDebounceCount((c) => c + 1)}>
          Increment Debounce Count
        </button>
      </div>
      <div>
        <h4>Previous Count: {previousCount}</h4>
        <h4>Current Count: {count}</h4>
      </div>

      <div>
        <h4>local/session storage</h4>
        <div>
          {name} - {age}{" "}
        </div>
        <button onClick={() => setName("Meesh")}>Set Name</button>
        <button onClick={() => setAge(40)}>Set Age</button>
        <button onClick={removeName}>Remove Name</button>
        <button onClick={removeAge}>Remove Age</button>
      </div>
    </div>
  );
}

export function useLocalStorage(key: string, defaultValue: any) {
  return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage(key: string, defaultValue: any) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

export function useStorage(key: string, defaultValue: any, storageObject: any) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue !== null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}

export function usePrevious(value: number | null) {
  const currentRef: MutableRefObject<number | null> = useRef(value);
  const previousRef: MutableRefObject<number | null> = useRef(null);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }
  return previousRef.current;
}

export function useToggle(defaultValue: any) {
  const [value, setValue] = useState(defaultValue);

  function toggleValue(value: any) {
    setValue((currentValue: any) =>
      typeof value === "boolean" ? value : !currentValue
    );
  }
  return [value, toggleValue];
}

export function useArray(defaultValue: any) {
  const [array, setArray] = useState(defaultValue);

  function push(element: any) {
    setArray((a: any) => [...a, element]);
  }

  function filter(callback: (a: any) => boolean) {
    setArray((a: string[]) => a.filter(callback));
  }

  function update(index: number, newElement: number) {
    setArray((a: number[]) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1, a.length - 1),
    ]);
  }

  function remove(index: number) {
    setArray((a: number[]) => [
      ...a.slice(0, index),
      ...a.slice(index + 1, a.length - 1),
    ]);
  }

  function clear() {
    setArray([]);
  }

  return { array, set: setArray, push, filter, update, remove, clear };
}

export function useTimeout(callback: () => any, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef: MutableRefObject<any> = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [clear, set]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}

// use debounce creates a delay, before running something. Like if you are typing into a search bar, and you would like to wait for the last keystroke to finish, before sending in the API query, this is a useful function to wait until that

export function useDebounce(callback: () => any, delay: number, dependencies: any[]) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}

export function useUpdateEffect(callback: () => any, dependencies: any[]) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies);
}

export function StateWithHistoryComponent() {
  const [count, setCount, rest] =
    useStateWithHistory(1);
  const { history, pointer, back, forward, go } = rest as any;
  const [name, setName] = useState("misha");

  type Callable = (v: any) => {};

  return (
    <div>
      <div>{count as ReactNode}</div>
      <div>{history.join(", ")}</div>
      <div>Pointer - {pointer}</div>
      <button onClick={() => (setCount as (v: any) => void)(((currentCount: any) => currentCount * 2) as (v: any) => {})}>
        Double
      </button>
      <button onClick={() => (setCount as (v: any) => void)((currentCount: number) => currentCount + 1)}>
        Increment
      </button>
    </div>
  );
}

export function useStateWithHistory(defaultValue: number, { capacity = 10 } = {}) {
  const [value, setValue] = useState(defaultValue);
  const historyRef = useRef([value]);
  const pointerRef = useRef(0);

  const set = useCallback(
    (v: any) => {
      const resolvedValue = typeof v === "function" ? v(value) : v;
      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1);
        }
        historyRef.current.push(resolvedValue);
        while (historyRef.current.length > capacity) {
          historyRef.current.shift();
        }
        pointerRef.current = historyRef.current.length - 1;
      }
      setValue(resolvedValue);
    },
    [capacity, value]
  );

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const go = useCallback((index: number) => {
    if (index < 0 || index >= historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
    },
  ];
}

export function AsyncComponent() {
  const { loading, error, value } = useAsync(
    () =>
      new Promise((resolve, reject) => {
        const success = true;
        setTimeout(() => {
          success ? resolve("Success") : reject(Error);
        }, 1000);
      })
  ) as any;

  const [id, setId] = useState(1);
  const { fetchLoading, fetchError, fetchValue } = useFetch(
    `https://jsonplaceholder.typicode.com/todos/id`,
    {},
    []
  ) as any;

  return (
    <div>
      <div>
        <div>Loading: {loading.toString()}</div>
        <div>{error}</div>
        <div>{value}</div>
      </div>
      <div>
        <div>{id}</div>
        <button onClick={() => setId((currentId) => currentId + 1)}>
          Increment ID
        </button>
        <div>Loading: {loading.toString}</div>
        <div>{JSON.stringify(error, null, 2)}</div>
        <div>{JSON.stringify(value, null, 2)}</div>
      </div>
    </div>
  );
}

const DEFAULT_OPTIONS = {
  headers: { "Content-Type": "application/json" },
};

export function useFetch(url: string, options = {}, dependencies = []) {
  return useAsync(
    () =>
      fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      }),
    dependencies
  );
}

export function useAsync(callback: () => any, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);
}

// Time for some DOM Manipulation scripts

export function ScriptComponent() {
  const { loading, error } = useScript(
    `https://code.jquery.com/jquery-3.6.0.min.js`
  ) as any;

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  return <div>{(window as any).$(window).width()}</div>;
}

export function useScript(url: string) {
  return useAsync(() => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    return new Promise((resolve, reject) => {
      script.addEventListener("load", resolve);
      script.addEventListener("error", reject);
      document.body.appendChild(script);
    });
  }, []);
}

export function EventListenerComponent() {
  const [key, setKey] = useState("");
  useEventListener("keydown", (e: KeyboardEvent) => {
    setKey(e.key);
  });

  return <div>Last Key: {key}</div>;
}

export function useEventListener(eventType: string, callback: (e: any) => void, element = window) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: any) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}

export function OnScreenComponent() {
  const headerTwoRef = useRef();
  const visible = useOnScreen(headerTwoRef, "-100px");

  return (
    <div>
      <h1>Header</h1>
      <p>Bunch of text</p>
      <h1 ref={headerTwoRef as LegacyRef<any>}>Header 2 {visible && "(Visible)"}</h1>
    </div>
  );
}

export function useOnScreen(ref: any, rootMargin = "0px") {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => {
      if (ref.current == null) return;
      observer.unobserve(ref.current);
    };
  }, [ref.current, rootMargin]);
  return isVisible;
}

export default function WindowSizeComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      {width} x {height}
    </div>
  );
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEventListener("resize", () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  });
  return windowSize;
}
