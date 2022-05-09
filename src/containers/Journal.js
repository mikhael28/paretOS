import { useState, useEffect, useRef } from "react";
import { init, exec } from "pell";
import { RestAPI } from "@aws-amplify/api-rest";
import { errorToast, successToast } from "../libs/toasts";
/**
 * This is the Learning Dashboard page, where the student sees their experience summaries (for navigation in mobile view) and the notepad, which they can use to take down notes and which will one day be expanded into a Roam-like daily notes system, into the ParetOS family of services.
 * @TODO Issue #32
 * @TODO Issue #55
 */

function LearnDashboard(props) {
  const [html, setHtml] = useState("");
  const editor = useRef(null);
  const [date, setDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(0);

  useEffect(() => {
    setHtml(notes[activeNote]);
    if (editor.current.content) {
      editor.current.content.innerHTML = notes[activeNote];
    }
  }, [activeNote]);

  useEffect(() => {
    setNotes(props.user.notes);

    editor.current = init({
      element: document.getElementById("editor"),
      onChange: (html) => setHtml(html),
      defaultParagraphSeparator: "p",
      actions: [
        {
          name: "bold",
        },
        {
          name: "underline",
        },
        {
          name: "italic",
        },
        {
          name: "strikethrough",
        },
        {
          name: "heading1",
        },
        {
          name: "heading2",
        },
        {
          name: "olist",
          title: "Numbered List",
        },
        {
          name: "ulist",
          title: "Bullet List",
        },
        {
          name: "quote",
        },

        {
          name: "link",
        },
        {
          name: "image",
          title: "Insert Image",
          result: () => {
            const url = prompt("Enter the image URL");
            if (url === null || url === "") {
              return;
            }
            const alt = prompt(
              "Enter the Alt Text\nIf your image is purely for decorative purposes, leave the input blank."
            );
            if (alt === null) {
              return;
            }
            const height = prompt(
              "Enter the Height\nUnits are in pixels\nLeave blank to use default"
            );
            if (height === null) {
              return;
            }
            const width = prompt(
              "Enter the Width\nUnits are in pixels\nLeave blank to use default"
            );
            if (width === null) {
              return;
            }
            if (url)
              exec(
                "insertHTML",
                `<img src=${url} width="${width}" height="${height}" alt="${alt}"  />`
              );
          },
        },
        {
          name: "code",
          title: "Start Code Block",
        },
        {
          name: "line",
        },
      ],
    });
    let newActiveNote;
    if (props.user.notes.length < 1) {
      newActiveNote = "<p></p>";
    } else {
      newActiveNote = props.user.notes[0];
    }
    setTimeout(() => {
      editor.current.content.innerHTML = newActiveNote;
      // testRef.current.innerHTML = "<p>Testing</p>";
    }, 0);
  }, []);

  async function editNote() {
    try {
      const result = await RestAPI.put("pareto", `/users/${props.user.id}`, {
        body: {
          notes: notes,
        },
      });
      setNotes(result.notes);
      successToast("Journal saved 👍");
    } catch (e) {
      errorToast(e, props.user);
    }
  }

  return (
    <div>
      <h2>Daily Journal {date}</h2>
      <button
        className="btn"
        onClick={() => {
          if (activeNote > 0) {
            let oldNotes = notes.slice();
            oldNotes[activeNote] = html;
            setNotes(oldNotes);
            setActiveNote(activeNote - 1);
          }
        }}
      >
        Previous Day
      </button>
      <button
        className="btn"
        onClick={() => {
          let oldNotes = notes.slice();
          oldNotes[activeNote] = html;
          if (activeNote === oldNotes.length - 1) {
            oldNotes.push("<p></p>");
          }
          setNotes(oldNotes);
          setActiveNote(activeNote + 1);
        }}
      >
        Next Day
      </button>
      <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
        <div className="col-xs-12" style={{ marginTop: 20 }}>
          <h3>Journal</h3>
          <div ref={editor} id="editor" className="pell" />
        </div>
      </div>
    </div>
  );
}

export default LearnDashboard;
