#!/bin/bash


function folderExist() {
    if [ ! -d "$pName" ];then
        echo "Folder "$pName" does not exist..."
        exit 0
    fi
}

function createProject(){
    if [[ $pName == "" ]];then
        echo "Project name is required...!!!"
        exit 0
    fi

    if [ -d "$pName" ]; then
        echo "$pName does exist..."
        read -rp "Do you want to delete the existing folder?(y/n) " delFolder
        if [[ "$delFolder" == "Y" || "$delFolder" == "y" ]];then
            rm -rf "$pName"
        else
            echo "Please try another name"
            exit 0
        fi
    fi


    echo "Create a folder for project"
    mkdir "$pName"
    echo "Project folder has been created"
    echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"
    echo "Creating the project"
    cd "$pName"
    canvas-sketch "$pName.js" --new --open
    echo "Project has been created and ready to be used...."

}

function deleteProject(){
    echo "Remove a project..."
    rm -rf "$pName"
}

function runProject(){
    echo "Running project..."
    folderExist
    cd "$pName"
    canvas-sketch "$pName.js" --open
}

function getOutput() {
    echo "Getting output..."
    folderExist
    read -rp "output foldername? " fName
    if [[ "$fName" == "" ]];then
        echo "Output foldername is required...!!!"
        exit 0
    fi
    cd "$pName"
    read -rp "Video output?(y/n) " vOut
    if [[ $vOut == 'Y' || $vOut == 'y' ]];then
        canvas-sketch "$pName.js" --output="output/$fName" --open --stream
    else
        canvas-sketch "$pName.js" --output="output/$fName" --open
    fi
}

read -rp "Project name? " pName
read -rp "What job do you want to do?(create/run/output/remove) " whichJob

if [[ $whichJob == "create" || $whichJob == "Create" ]];then
    createProject
elif [[ $whichJob == "run" || $whichJob == "Run" ]];then
    runProject
elif [[ $whichJob == "output" || $whichJob == "Output" ]];then
    getOutput
elif [[ $whichJob == "remove" || $whichJob == "Remove" ]];then
    deleteProject
else
    echo "Job has not been defined...!!!!"
    echo "Please try again"
    exit 0
fi