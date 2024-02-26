*담당자(기능별)*
이재진 장수영 조창래

1. Entity
	- UserEntity[조창래]
	- PointEntity[조창래]
	- GameResultEntity [조창래]
	- PointEntity [조창래]
	- MessageEntity [조창래]
	- UserFriendEntity [이재진]

2. Repository
	- UserFriendRepository[이재진]
	- UserRepository[조창래]
	- PointRepository[조창래]
	- MessageRepository[조창래]

3. Dto
	- RoomListDto [장수영]
	- CreateRoomDto [장수영]
	- RankResDto [장수영]
	- RankReqDto [장수영]
	- UserFriendDto[이재진]
	- SignupReqDto [조창래]
	- SignupResDto[조창래]
	- LoginReqDto [조창래]
	- LoginResDto [조창래]
	- JWTDto [조창래]
	- GameResultDto [조창래]
	- PointDto [조창래]
	- MessageDto [조창래]

4. Controller
	- RoomController [장수영]
	- StompRoomController [장수영]
	- RankController [장수영]
	- StompRankController [장수영]
	- UserFriendController[이재진]
	- UserController [조창래]
	- RankController [조창래]

5. Service
	- RoomService [장수영]
	- RankService [장수영]
	- UserFriendService[이재진]
	- UserService [조창래]
	- RankService [조창래]
	- PointService [조창래]
	- MessageService [조창래]

6. Exception
	
7. Config
	- RedisConfig [장수영]
	- STOMPConfig [조창래]
	- SecurityConfig [조창래]
	- SwaggerConfig [장수영]

8. Filter
	- JWTAuthFilter [조창래]

9. Infra
	- SpringBoot Docker Image [이재진]
	- React Docker Image [이재진]
	- MySQL Redis [이재진]
	- Jenkins [이재진] 
	- AWS EC2 [이재진]