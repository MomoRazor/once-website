# once-website

# System Structure

# Entities:

    - Circle
        - code: string
        - members: string[]
        - story: string
        - settings: {
            maxMembers: number
            minMembers: number
            numberOfWords: number
            delay: number
        }
        - current: {
            status: 'Active' | 'Waiting' | 'Done'
            lastModification: DateTime
            index: number
        }
    - Users (Firebase Anon)
        - circle: {
            id: string
            status: 'Active' | 'Waiting' | 'Done'
            userIndex: number
            currentIndex: number
            circleSize: number
        }

# System Flow

Circle management happenes through the server. The flow for this system works in the following way:

    - A user navigates to the website
    - The website checks if the user is already in a circle
        - If yes, the game flow continues*
        - If no, the user automatically attempts to join a circle**

    *The Game Flow
    - The website checks the status of the circle for that user with the circle information embedded in the user
        - If the status is 'Waiting', the website simply displays a loading time, with the amount of users it needs to start as well as the current users waiting within the circle.
        - If the status is 'Active', the website must check the indexes
            - If the userIndex and the currentIndex are the same, the website is expecting the user to contribute a word. This means the website will allow word input, while showing the amount of time left for input. If the word is inputted, the queued skipping function must be reset.
            - If the userIndex and currentIndex are not the same, the website must show the user the current user writing (index number), and how many users still need their turn before the current user. Also the time must be visible for the current user.
            - In both the above situations, the number of words still remaining for the conclusion of this circle must be visible
        - If the status is 'Done', the website must read out the story (AI Voice), following which the user is offered joining a new circle. It must also Deactivate****


    **The Circle Joining Flow
    - If a user asks to join a circle, the server must
        - Check which circles are Waiting
            - If any exist, the user may join this one
                - If a circle that is Waiting is joined with, the serve must check if the circle needs to be Activated***.
            - If not, the server checks which circles are Active
                - If the circle still has space, the user joins this circle
                - If not, the server creates*** a new default circle and allows the user to join this circle**

    ***Circle Activation
    - If a circle is activated, the server must
        - Switch the appropriate status for the appropriate circle, as well as all its members
        - Queue a skipping function of this circle. This will allow the circle the skip a user that does not input a word when its their turn, after a certain timeout.

    ****Circle Deactivation
    -If a cricle is deactivated, the server must
        - Switch the appropriate status for the appropriate circle, as well as all its members
        - Cancel any queued functions for this circle.

    Extras, nice to haves
    - The ability for the user to join whatever circle they wish
    - The ability for the user to create their own circle
    - Easier sharing and post on socials, the story created at the end
    - The latest 10 stories created on system visible before joining a circle, and the ability to hear them.
    - Non-anon, socials users.
