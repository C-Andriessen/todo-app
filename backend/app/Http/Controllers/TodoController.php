<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoValidation;
use App\Http\Requests\UpdateTodoValidation;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return TodoResource::collection(Todo::orderByDesc('created_at')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\StoreTodoValidation  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTodoValidation $request)
    {
        $todo = new Todo();
        $todo->title = $request->title;
        $todo->description = $request->description;
        $todo->status = $request->status;
        if ($request->image)
        {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $todo->image = $imageName;
        }
        $todo->save();

        return $todo;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function changeState(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->status = $request->status;
        $todo->save();
        return "done";
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTodoValidation $request, $id)
    {
        $todo = Todo::findOrFail($id);
        $todo->title = $request->title;
        $todo->description = $request->description;
        $todo->status = $request->status;
        if ($request->image)
        {
            if ($todo->image)
            {
                unlink(public_path('/images/' . $todo->image));
            }
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $todo->image = $imageName;
        }
        $todo->save();

        return $id;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        if ($todo->image)
        {
            unlink(public_path('/images/' . $todo->image));
        }
        $todo->delete();
        return '"' . $todo->title . '" has been deleted';
    }

    /**
     * Remove the image from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyImage($id)
    {
        $todo = Todo::findOrFail($id);
        unlink(public_path('/images/' . $todo->image));
        $todo->image = null;
        $todo->save();
        return $todo;
    }
}
