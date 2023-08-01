export type TodoResponse = {
    id: number,
    text: string,
    done: boolean
    date: Date


}

// 以下是客户的房屋需求数据结构定义:
export interface CustomerHouseRequest {
    area: string;
    roomCount: number;
    budget: string;
    floor: string;
    isContinueGuiding: boolean;  // 是否需要继续引导,如果提取出的信息过少，需要继续引导
    nextQuestion: string; // 引导话术，如果isContinueGuiding为true，请生成引导话术
}