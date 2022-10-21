import { useState, useEffect, useRef, useContext } from "react";
import { init, exec } from "pell";
import { RestAPI } from "@aws-amplify/api-rest";
import { ToastMsgContext } from "../state/ToastContext";
import { User } from "../types/ProfileTypes";
/**
 * This is the Learning Dashboard page, where the student sees their experience summaries (for navigation in mobile view) and the notepad, which they can use to take down notes and which will one day be expanded into a Roam-like daily notes system, into the ParetOS family of services.
 * @TODO Issue #32
 */

interface JournalProps {
  user: User;
}

function Journal(props: JournalProps) {
  const [html, setHtml] = useState("");
  const editor = useRef<any>(null);
  const [date, setDate] = useState(null);
  // @TODO update this typing with what the Notes turns out to be
  const [notes, setNotes] = useState<any>([]);
  const [activeNote, setActiveNote] = useState(0);

  const { handleShowSuccess, handleShowError } = useContext(ToastMsgContext);

  useEffect(() => {
    setHtml(notes[activeNote]);
    if (editor.current.content) {
      editor.current.content.innerHTML = notes[activeNote];
    }
  }, [activeNote]);

  useEffect(() => {
    setNotes(props.user.notes);

    editor.current = init({
      element: document.getElementById("editor") as any,
      onChange: (html: any) => setHtml(html),
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
      ] as any,
    });
    let newActiveNote: any;
    if ((props.user.notes || []).length < 1) {
      newActiveNote = "<p></p>";
    } else {
      newActiveNote = (props.user.notes || [])[0];
    }
    setTimeout(() => {
      editor.current.content.innerHTML = newActiveNote;
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
      handleShowSuccess("Journal saved 👍");
    } catch (e) {
      handleShowError(e as Error);
    }
  }

  return (
    <div>
      <h2>Daily Journal {date}</h2>
      <p>
        Note: this functionality isn't currently working/saving, this is a
        preview.
      </p>
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

export default Journal;
