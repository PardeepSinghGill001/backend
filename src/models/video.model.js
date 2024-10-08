import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile:{
            type:String,//cloudinary url
            required:true,
        },
        thumbnail:{
            type:String,//cloudinary url
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,//cloudinary shares meta data about data once it stores it
            //from there we get duration of video.
            required:true,
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            defalt:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)
//mongoose allows use to add our our plugins
//this aggreagte framework came into mongodb recently
//we add it as a plugin
//now, we can write aggregation queries also (regular queries were possible even without it)
//this aggregation pipeline of mongoose will take our project to advance level
export const Video = mongoose.model("Video",videoSchema);