import mongoose from "mongoose";

export type Attribute = {
  key: string;
  value: string;
};


export interface INode {
  _id: string;
  parent?: string;
  type: "div" | "paragraph" | "text" | "image" | "video";
  attributes: Attribute[];
  children: INode[];
}

const NodeSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: false,
  },
  type: {
    type: String,
    required: true,
    enum: ["div", "paragraph", "text", "image", "video"],
  },
  attributes: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  ],
});

const Node = mongoose.models.Node || mongoose.model("Node", NodeSchema);

export default Node;
