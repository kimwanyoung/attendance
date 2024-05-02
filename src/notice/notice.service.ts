import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { NoticeModel } from "./entity/notice.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NoticeDto } from "./dto/notice.dto";

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeModel)
    private readonly noticeRepository: Repository<NoticeModel>,
  ) {}

  async createNotice(userId: number, groupId: number, data: NoticeDto) {
    const notice = this.noticeRepository.create({
      ...data,
      author: { id: userId },
      group: { id: groupId },
    });

    return await this.noticeRepository.save(notice);
  }

  async findAllNotice(groupId: number) {
    return await this.noticeRepository.find({
      where: {
        group: { id: groupId },
      },
    });
  }

  async findNoticeDetail(groupId: number, noticeId: number){
    return await this.noticeRepository.findOne({
      where: {
        id: noticeId,
        group: { id: groupId },
      },
      relations: ["author"],
    });
  }
  async deleteNotice(postId: number) {
    return await this.noticeRepository.delete(postId);
  }

  async updateNotice(noticeId: number, dto: NoticeDto) {
    const updatedNotice = this.noticeRepository.create({
      id: noticeId,
      ...dto,
    });

    return await this.noticeRepository.save(updatedNotice);
  }
}
