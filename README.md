meteor-os
=========

An application manager that sits on top of the https://github.com/jchristman/meteor-application-manager repository to create layered applications. See http://meteor-os.meteor.com/ for a live demo. You can login with any user with username in {a-z} and password 'asdf'.

notes
=====

I know there is no documentation yet. That is low on my TODO list. See the [builtins](https://github.com/jchristman/meteor-os/tree/master/builtins) directory for an example of robust applications.

A couple of notes on the state of MeteorOS. I'm decently satisfied with the overall system and have the following TODO list on it:
 1. Finish file sharing model. I just finished a team management app that works pretty well (if you start the "Settings" app from the "Start Menu") and I am currently rewriting the file system into the builtins/file-browser app.
 2. Finish the settings app to include profile management and UI settings.
 3. Make the app windows be able to popout. I just wrote a library that does this. [jchristman:popout](https://atmospherejs.com/jchristman/popout)
 4. Make the entire UI system look less crappy.
 5. Make the background image customizable.
 6. Write better right click menus
 7. Make applications "minimize" into the "taskbar" at the bottom of the page
 8. Write chat into the system. Possibly build into the taskbar in the bottom right corner (like Facebook)?
 9. DOCUMENTATION
