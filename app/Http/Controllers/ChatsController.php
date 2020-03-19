<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Message;
use App\User;
use App\Events\MessageSent;
use App\Events\MessagePublished;
class ChatsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //show chats
    public function index(){
        return view('chat');
    }

    //fetched message related to the user
    public function fetchMessages(){
        return Message::with('user')->get();
    }

    //send message to brodband and event
    public function sendMessage(Request $request){
        $user = Auth::user();

        $message = $user->messages()->create([
            'message' => $request->input('message')
        ]);
        broadcast(new MessageSent($user,$message))->toOthers();

        event(new MessagePublished($user,$message));

        return response($message, 201);
//        return response(['status' => 'Message Sent!!',$message]);
    }

}
