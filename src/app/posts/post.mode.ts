export interface PostModel {
    _id:string,
    title:string,
    caption:string,
    dp:string,
    image: File,
    username:string,
    createdAt: string,
    updatedAt: string,
    likedBy: [
        {
            name:string,
            username:string,
            dp:File
        }
    ],
    commentedBy: [
        {
            name: string,
            comments: any[],
            commentedAt:string
        }
    ],
    comments:number,
    openExpansion:boolean
}