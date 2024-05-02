const fortuneList = [
    "Did you know that fortune cookies aren’t even Chinese? They’re made by Americans, based on a Japanese recipe.",
    "You have an ability to sense and know higher truth.",
    "Excellent time to become a missing person.",
    "Don’t look back, the lemmings are gaining on you.",
    "You look tired.",
    "Chess tonight.",
    "Don’t feed the bats tonight.",
    "Your boss is a few sandwiches short of a picnic.",
    "You will forget that you ever knew me.",
    "Future looks spotty. You will spill soup in late evening.",
    "You have the capacity to learn from mistakes. You’ll learn a lot today.",
    "A vivid and creative mind characterizes you.",
    "If you think last Tuesday was a drag, wait till you see what happens tomorrow!",
    "You will be attacked next Wednesday at 3:15 P.M. by six samurai sword wielding purple fish glued to Harley-Davidson motorcycles.",
    "There was a phone call for you.",
    "Are you making all this up as you go along?",
    "Don’t plan any hasty moves. You’ll be evicted soon anyway.",
    "Advancement in position.",
    "You’re ugly and your mother dresses you funny.",
    "Be careful! Is it classified?"
]

export default function getFortune(): string {
    const randomIndex = Math.floor(Math.random() * fortuneList.length);
    return fortuneList[randomIndex];
}