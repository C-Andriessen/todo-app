import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

export default function Card(props) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [title, setTitle] = useState(props.card.title);
  const [description, setDescription] = useState(props.card.description);
  const [image, setImage] = useState(props.card.image);
  const [tempImage, setTempImage] = useState({ name: null, file: null });
  const [status, setStatus] = useState(props.card.status);
  const [errors, setErrors] = useState({});

  function handleDelete() {
    if (
      window.confirm(`Are you sure you want to delete "${props.card.title}"?`)
    ) {
      axios
        .delete(`${process.env.REACT_APP_SERVER}/api/todo/${props.card.id}`)
        .then((res) => {
          setFlashMessage({
            data: res.data,
            color: "bg-red-500",
          });
          setDeleted(true);
        });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_method", "put");
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    if (tempImage.file) formData.append("image", tempImage.file);
    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/todo/${props.card.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(() => {
        props.setTodos([]);
        setOpen(false);
        setEdit(false);
        setTempImage({ name: null, file: null });
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      });
  }

  function changeState(e) {
    axios
      .put(`${process.env.REACT_APP_SERVER}/api/todo/${props.card.id}/state`, {
        status: e.target.value,
      })
      .then(() => {
        props.setTodos([]);
      });
  }

  function deleteImage() {
    if (window.confirm(`Are you sure you want to delete the image?`)) {
      axios
        .delete(
          `${process.env.REACT_APP_SERVER}/api/todo/${props.card.id}/image`
        )
        .then(() => {
          setImage(null);
        });
    }
  }

  if (deleted) {
    return (
      <>
        {flashMessage ? (
          <div
            className={
              flashMessage.color +
              " text-white px-5 py-2 rounded-full absolute top-8 right-10 flex items-center"
            }
          >
            {flashMessage.data}{" "}
            <span
              className="hover:cursor-pointer"
              onClick={() => {
                setFlashMessage(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 font-extrabold ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
        ) : null}
      </>
    );
  } else {
    return (
      <>
        <div
          className="bg-gray-50 p-3 rounded-lg mb-5 hover:cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {image ? (
            <img
              src={`${process.env.REACT_APP_SERVER}/images/${props.card.image}`}
              alt={props.card.image}
              className="h-40 w-full object-contain mb-3"
            />
          ) : null}
          <h3 className="">{props.card.title}</h3>
          <p className="text-sm text-gray-500">
            {props.card.description && props.card.description?.length > 200
              ? props.card.description.trim().substring(0, 200).concat("...")
              : props.card.description}
          </p>
        </div>

        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                    <div>
                      <div className=" absolute right-5 top-5 flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:cursor-pointer"
                          onClick={() => {
                            edit ? setEdit(false) : setEdit(true);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:cursor-pointer ml-2"
                          onClick={handleDelete}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>

                      {edit ? null : (
                        <select
                          value={props.card.status}
                          onChange={changeState}
                          className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value={0}>Todo</option>
                          <option value={1}>In progress</option>
                          <option value={2}>Done</option>
                        </select>
                      )}

                      <div className={edit ? "hidden" : "sm:mt-5"}>
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-semibold leading-6 text-gray-900"
                        >
                          {props.card.title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {props.card.description}
                          </p>
                        </div>
                        {image ? (
                          <>
                            <img
                              src={`${process.env.REACT_APP_SERVER}/images/${image}`}
                              alt={image}
                              className="w-full object-contain mt-5 mb-3"
                            />
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={deleteImage}
                            >
                              Delete image
                            </button>
                          </>
                        ) : null}
                      </div>
                      <form
                        className={edit ? "sm:mt-5" : "hidden"}
                        onSubmit={handleSubmit}
                      >
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
                              <p className="text-red-500 text-sm">
                                {errors.title}
                              </p>
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
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Status
                          </label>
                          <select
                            id="location"
                            name="location"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={status}
                            onChange={(e) => {
                              setStatus(e.target.value);
                            }}
                          >
                            <option value={0}>Todo</option>
                            <option value={1}>In Progress</option>
                            <option value={2}>Done</option>
                          </select>
                        </div>

                        <div className="mt-2">
                          <label htmlFor="image">
                            <input
                              type="file"
                              name="image"
                              id="image"
                              className="sr-only"
                              onChange={(e) => {
                                setTempImage({
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
                                {tempImage.name
                                  ? tempImage.name
                                  : "No file has been chosen"}
                              </p>
                            </div>
                          </label>
                          {errors?.image ? (
                            <p className="text-red-500 text-sm">
                              {errors.image}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-5 sm:mt-6">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }
}
