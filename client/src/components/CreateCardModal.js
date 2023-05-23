import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

export default function CreateCardModal(props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState({ name: null, file: null });
  const [errors, setErrors] = useState({});
  const [type, setType] = useState("");

  useEffect(() => {
    if (props.status === 0) {
      setType("Todo");
    } else if (props.status === 1) {
      setType("In progress");
    } else if (props.status === 2) {
      setType("Done");
    }
  }, [props.status]);

  const cancelButtonRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", props.status);
    if (image.file) formData.append("image", image.file);
    setErrors({});
    axios
      .post(`${process.env.REACT_APP_SERVER}/api/todo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        props.setTodos([...props.todos, res.data]);
        setOpen(false);
        setTitle("");
        setDescription("");
        setImage({ name: null, file: null });
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      });
  }

  return (
    <>
      <button
        className="text-gray-50"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Add Card
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 mb-2"
                      >
                        Add todo card - {type}
                      </Dialog.Title>
                    </div>
                  </div>
                  <form id={props.formId} onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Title
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="block w-full rounded-md border-0  pl-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Title of the card"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                        />
                        {errors?.title ? (
                          <p className="text-red-500">{errors.title}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          type="text"
                          name="description"
                          id="description"
                          className="block w-full rounded-md border-0  pl-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="image">
                        <input
                          type="file"
                          name="image"
                          id="image"
                          className="sr-only"
                          onChange={(e) => {
                            setImage({
                              file: e.target.files[0],
                              name: e.target.value.replace(
                                "C:\\fakepath\\",
                                ""
                              ),
                            });
                          }}
                        />
                        <p className="mb-2 block text-sm font-medium leading-6 text-gray-900">
                          Foto
                        </p>
                        <div className="flex items-center hover:cursor-pointer">
                          <p className="rounded-md bg-gray-600 px-3 py-2 text-sm text-white">
                            File upload
                          </p>
                          <p id="image_item" className="ml-3">
                            {image.name
                              ? image.name
                              : "No file has been chosen"}
                          </p>
                        </div>
                      </label>
                      {errors.image ? (
                        <p className="text-red-500 text-sm">{errors.image}</p>
                      ) : null}
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        formTarget={props.formId}
                        className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
